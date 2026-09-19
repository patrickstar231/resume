import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { scrollState } from '../state/scroll';

/* ── 「巨型扭蛋机」固定舱内层（纯装饰，DOM 才是信息载体） ─────────
   · 弧形玻璃仓：instanced 半球壳（半透明）+ 半球底（三原色实色）
   · 自写弹簧物理：滚动速度与指针给胶囊沉降 / 晃动冲量，无物理依赖
   · 当期胶囊沿螺旋滑道缓缓落下，落点 = DOM 取物盘
   ───────────────────────────────────────────────────────────── */

const COUNT = 30;
const R = 0.36;
const HEX = {
  punch: '#e23b2e',
  capsule: '#f5c518',
  cobalt: '#2456c7',
  gold: '#c99320',
} as const;
const PALETTE = ['punch', 'capsule', 'cobalt', 'capsule', 'punch', 'cobalt'] as const;

/** 确定性随机：同一 seed 每次构图一致，截图复验可对比 */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Field = {
  rest: Float32Array;
  pos: Float32Array;
  vel: Float32Array;
  quat: THREE.Quaternion[];
};

function buildField(): Field {
  const rand = mulberry32(20260919);
  const rest = new Float32Array(COUNT * 3);
  const pos = new Float32Array(COUNT * 3);
  const vel = new Float32Array(COUNT * 3);
  const quat: THREE.Quaternion[] = [];

  for (let i = 0; i < COUNT; i += 1) {
    const layer = Math.floor(i / 10); // 0 底层 … 2 顶层：底密顶疏
    const slot = i % 10;
    const ring = layer === 2 ? 1.15 : 1.85;
    const angle = (slot / 10) * Math.PI * 2 + layer * 0.52 + rand() * 0.34;
    const radius = ring * (0.32 + rand() * 0.68);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius * 0.62 - 0.15;
    const y = -1.85 + layer * 1.02 + rand() * 0.42;
    rest.set([x, y, z], i * 3);
    pos.set([x, y, z], i * 3);
    quat.push(
      new THREE.Quaternion().setFromEuler(
        new THREE.Euler(rand() * 1.3 - 0.65, rand() * Math.PI * 2, rand() * 1.3 - 0.65),
      ),
    );
  }
  return { rest, pos, vel, quat };
}

const topGeometry = new THREE.SphereGeometry(1, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2);
const bottomGeometry = new THREE.SphereGeometry(1, 22, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
const seamGeometry = new THREE.TorusGeometry(1, 0.055, 6, 24).rotateX(Math.PI / 2);

function CapsuleField({ reduced }: { reduced: boolean }) {
  const field = useMemo(buildField, []);
  const top = useRef<THREE.InstancedMesh>(null);
  const bottom = useRef<THREE.InstancedMesh>(null);
  const seam = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tint = useMemo(() => new THREE.Color(), []);

  const colors = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) =>
        i === 7 ? HEX.gold : HEX[PALETTE[i % PALETTE.length]],
      ),
    [],
  );

  useEffect(() => {
    [top.current, bottom.current, seam.current].forEach((mesh) => {
      if (!mesh) return;
      colors.forEach((hex, i) => {
        mesh.setColorAt(i, tint.set(hex));
      });
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    });
  }, [colors, tint]);

  const write = (i: number) => {
    const meshes = [top.current, bottom.current, seam.current];
    dummy.position.set(field.pos[i * 3], field.pos[i * 3 + 1], field.pos[i * 3 + 2]);
    dummy.quaternion.copy(field.quat[i]);
    dummy.scale.setScalar(R);
    dummy.updateMatrix();
    meshes[0]?.setMatrixAt(i, dummy.matrix);
    meshes[1]?.setMatrixAt(i, dummy.matrix);
    meshes[2]?.setMatrixAt(i, dummy.matrix);
  };

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    const meshes = [top.current, bottom.current, seam.current];
    if (meshes.some((m) => !m)) return;

    if (reduced) {
      for (let i = 0; i < COUNT; i += 1) write(i);
      meshes.forEach((m) => m && (m.instanceMatrix.needsUpdate = true));
      return;
    }

    // 滚动速度 → 一次冲量；指针 → 轻微侧倾；两者都靠弹簧自己收敛
    const kick = THREE.MathUtils.clamp(scrollState.velocity * 0.004, -0.22, 0.22);
    const sink = -scrollState.heroProgress * 0.35 - kick;
    const leanX = scrollState.pointerX * 0.22;
    const leanY = scrollState.pointerY * 0.12;
    const stiff = 16;
    const damp = 1 - Math.min(delta * 5.4, 0.6);
    const time = performance.now() * 0.001;

    for (let i = 0; i < COUNT; i += 1) {
      const o = i * 3;
      const wob = Math.sin(time * 0.9 + i) * 0.012;
      const tx = field.rest[o] + leanX + wob;
      const ty = field.rest[o + 1] + sink + leanY * 0.4;
      const tz = field.rest[o + 2];
      field.vel[o] += (tx - field.pos[o]) * stiff * delta;
      field.vel[o + 1] += (ty - field.pos[o + 1]) * stiff * delta;
      field.vel[o + 2] += (tz - field.pos[o + 2]) * stiff * delta;
      field.vel[o] *= damp;
      field.vel[o + 1] *= damp;
      field.vel[o + 2] *= damp;
      field.pos[o] += field.vel[o] * delta;
      field.pos[o + 1] += field.vel[o + 1] * delta;
      field.pos[o + 2] += field.vel[o + 2] * delta;
      write(i);
    }
    meshes.forEach((m) => m && (m.instanceMatrix.needsUpdate = true));
  });

  return (
    <group>
      {/* 上半壳：半透明塑料 */}
      <instancedMesh ref={top} args={[topGeometry, undefined, COUNT]}>
        <meshStandardMaterial
          transparent
          opacity={0.42}
          roughness={0.14}
          metalness={0.05}
          depthWrite={false}
        />
      </instancedMesh>
      {/* 下半球：三原色实色 */}
      <instancedMesh ref={bottom} args={[bottomGeometry, undefined, COUNT]}>
        <meshStandardMaterial roughness={0.38} metalness={0.03} />
      </instancedMesh>
      {/* 合模缝：玩具说明书式的结构诚实 */}
      <instancedMesh ref={seam} args={[seamGeometry, undefined, COUNT]}>
        <meshStandardMaterial color="#2b2320" roughness={0.6} metalness={0} />
      </instancedMesh>
    </group>
  );
}

/** 当期胶囊：随 workProgress 沿螺旋滑道落到取物盘 */
function Runner({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef(0);
  const colors = useMemo(() => [HEX.punch, HEX.cobalt, HEX.capsule], []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const ease = 1 - Math.exp(-6 * Math.min(delta, 1 / 30));
    const p = reduced ? 1 : scrollState.workProgress;
    const angle = 0.6 + p * Math.PI * 2.15;
    const radius = (1 - p) * 1.35;
    const targetX = Math.cos(angle) * radius;
    const targetZ = Math.sin(angle) * radius * 0.6;
    const targetY = 2.5 - p * 4.6;
    g.position.x += (targetX - g.position.x) * (reduced ? 1 : ease);
    g.position.z += (targetZ - g.position.z) * (reduced ? 1 : ease);
    g.position.y += (targetY - g.position.y) * (reduced ? 1 : ease);
    spin.current += reduced ? 0 : delta * (0.7 + (1 - p) * 2.6);
    g.rotation.set(Math.sin(spin.current) * 0.5, spin.current, Math.cos(spin.current) * 0.34);
    const s = 0.5 + p * 0.12;
    g.scale.setScalar(s);
  });

  return (
    <group ref={group} position={[0, 2.5, 0]}>
      <mesh geometry={topGeometry}>
        <meshStandardMaterial
          color={colors[2]}
          transparent
          opacity={0.5}
          roughness={0.1}
          metalness={0.06}
        />
      </mesh>
      <mesh geometry={bottomGeometry}>
        <meshStandardMaterial color={colors[0]} roughness={0.32} metalness={0.04} />
      </mesh>
      <mesh geometry={seamGeometry}>
        <meshStandardMaterial color="#2b2320" roughness={0.6} />
      </mesh>
      {/* 胶囊里的「奖品」：一颗实心钴蓝核 */}
      <mesh position={[0, -0.16, 0]}>
        <sphereGeometry args={[0.44, 18, 14]} />
        <meshStandardMaterial color={colors[1]} roughness={0.42} />
      </mesh>
    </group>
  );
}

function Chute() {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i += 1) {
      const t = i / 40;
      const angle = 0.6 + t * Math.PI * 2.15;
      const radius = (1 - t) * 1.35;
      points.push(
        new THREE.Vector3(Math.cos(angle) * radius, 2.5 - t * 4.6, Math.sin(angle) * radius * 0.6),
      );
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 90, 0.045, 8, false);
  }, []);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#2b2320" roughness={0.55} />
    </mesh>
  );
}

/** 弧形玻璃仓：内衬深蓝 + 底盘 + 取物盘 */
function Chamber() {
  return (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[2.55, 2.55, 5.6, 40, 1, true]} />
        <meshStandardMaterial color="#1d2b36" side={THREE.BackSide} roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, 0]}>
        <circleGeometry args={[2.55, 40]} />
        <meshStandardMaterial color="#16212a" roughness={1} />
      </mesh>
      {/* 仓口棕圈：与 DOM 的 2px 描线同一语言 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <torusGeometry args={[2.5, 0.07, 10, 44]} />
        <meshStandardMaterial color="#2b2320" roughness={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2.58, 0]}>
        <torusGeometry args={[2.5, 0.07, 10, 44]} />
        <meshStandardMaterial color="#2b2320" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Cabin({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { size } = useThree();

  useFrame((_, rawDelta) => {
    const g = group.current;
    if (!g) return;
    const delta = Math.min(rawDelta, 1 / 30);
    const ease = reduced ? 1 : 1 - Math.exp(-4 * delta);
    // 相机 fov 34° @ z 8.4 ⇒ 整个视口高 ≈ 5.14 世界单位
    const unit = size.height / 5.14;
    const wide = size.width >= 1024;
    const targetX = wide ? (size.width * 0.26) / unit : 0;
    const targetScale = wide ? 0.5 : size.width < 780 ? 0.62 : 0.56;
    const targetY = wide ? -0.1 : 0.3;
    g.position.x += (targetX - g.position.x) * ease;
    g.position.y += (targetY - g.position.y) * ease;
    g.scale.x += (targetScale - g.scale.x) * ease;
    g.scale.y = g.scale.z = g.scale.x;
    if (!reduced) {
      g.rotation.y += (scrollState.pointerX * 0.13 - g.rotation.y) * ease;
      g.rotation.x += (-scrollState.pointerY * 0.07 - g.rotation.x) * ease;
    }
  });

  return (
    <group ref={group} scale={1}>
      <Chamber />
      <Chute />
      <CapsuleField reduced={reduced} />
      <Runner reduced={reduced} />
    </group>
  );
}

/** 减弱动效：只出一帧静态陈列（胶囊静止、当期胶囊停在取物盘） */
function StaticFrame() {
  const { invalidate } = useThree();
  useEffect(() => {
    const id = requestAnimationFrame(() => invalidate());
    return () => cancelAnimationFrame(id);
  }, [invalidate]);
  return null;
}

export function PrizeCabin({ reduced }: { reduced: boolean }) {
  const [live, setLive] = useState(true);

  useEffect(() => {
    const onScroll = () => setLive(scrollState.cabinLive);
    const onPointer = (e: PointerEvent) => {
      if (reduced) return;
      scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [reduced]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: live ? 1 : 0, transition: 'opacity 400ms linear' }}
    >
      <Canvas
        camera={{ position: [0, 0.15, 8.4], fov: 34 }}
        dpr={[1, 2]}
        frameloop={reduced ? (live ? 'demand' : 'never') : live ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.35} />
        <directionalLight position={[3.2, 5.4, 4.2]} intensity={2.1} />
        <directionalLight position={[-4, -1.2, 2.6]} intensity={0.45} />
        <Suspense fallback={null}>
          <Cabin reduced={reduced} />
        </Suspense>
        {reduced ? <StaticFrame /> : null}
      </Canvas>
    </div>
  );
}
