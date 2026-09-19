import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { coaster, clamp } from '../state/coaster';
import { projects } from '../data/site';

/* ================= 素材：纯色 / 平涂 canvas 贴图 ================= */

const C = {
  night: '#0f2018',
  nightLift: '#16301f',
  edge: '#0a1410',
  candy: '#d93a2b',
  candyShade: '#a92a1f',
  cream: '#f4ebdd',
  brass: '#d9a441',
};

/** 红白相间的轨道皮：TubeGeometry 的 u 沿长度方向，所以条纹做在 X 上。硬边，无渐变。 */
function railTexture() {
  const cv = document.createElement('canvas');
  cv.width = 64;
  cv.height = 8;
  const ctx = cv.getContext('2d');
  if (ctx) {
    ctx.fillStyle = C.candy;
    ctx.fillRect(0, 0, 64, 8);
    // 红为主、奶油为段：两侧用暗红硬边隔开（平涂明暗，不是渐变）
    ctx.fillStyle = C.candyShade;
    ctx.fillRect(13, 0, 4, 8);
    ctx.fillRect(30, 0, 4, 8);
    ctx.fillStyle = C.cream;
    ctx.fillRect(17, 0, 13, 8);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  return tex;
}

/** 半调网点：用点的半径做明暗，而不是透明度/渐变。 */
function halftoneTexture(step: number, r: number, color = C.cream) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 256;
  const ctx = cv.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    ctx.fillStyle = color;
    for (let y = 0; y < 260; y += step) {
      for (let x = 0; x < 260; x += step) {
        const wob = 0.5 + 0.5 * Math.sin((x + y * 0.62) * 0.05);
        ctx.beginPath();
        ctx.arc(x + (y / step) * 3, y, r * wob, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** 站名牌：Alfa Slab One + 硬边红框。webfont 就绪后重绘一次，失败则静默用回退字形。 */
function signTexture(title: string, sub: string, serial: string) {
  const cv = document.createElement('canvas');
  cv.width = 1024;
  cv.height = 200;
  const draw = () => {
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = C.candy;
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = C.cream;
    ctx.fillRect(9, 9, cv.width - 18, cv.height - 18);
    ctx.fillStyle = C.edge;
    ctx.textBaseline = 'middle';
    ctx.font = '62px "Alfa Slab One", "ChironHeiHK", serif';
    ctx.fillText(title.toUpperCase().slice(0, 24), 32, 68);
    ctx.fillStyle = C.candyShade;
    ctx.font = '700 32px Archivo, sans-serif';
    ctx.fillText(sub.slice(0, 34), 32, 138);
    ctx.fillStyle = C.brass;
    ctx.font = '700 30px Archivo, sans-serif';
    ctx.fillText(serial, cv.width - 96, 138);
  };
  draw();
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  document.fonts?.ready
    ?.then(() => {
      draw();
      tex.needsUpdate = true;
    })
    .catch(() => undefined);
  return tex;
}

/* ================= 轨道曲线 ================= */

/**
 * walker 式轨道：固定步长 + 每步「转角 / 爬升」积分而成。
 * 这样能精确控制「阅读区 = 直道、特技 = 直道之间的弯段」——
 * 三块站台屏都立在直道末端，进站全程在右半屏里完整入画（几何已用 Node 验算）。
 * 爬坡 → 俯冲 → station-1 直道 → 左螺旋 → station-2 高架直道 → 右长降 → station-3 直道 → 制动上坡进站。
 */
const SEG = 5;
const PLAN: readonly [number, number][] = [
  [0, 1.8], // 链式爬坡（登车）
  [0, 1.9],
  [0, 2.0], // → u .125 顶点
  [0, -2.2], // 俯冲
  [4, -2.6], // → u .208 谷底
  [3, -0.4], // ┐ station-1 直道
  [0, 0.2],
  [0, 0.2], // 站屏 #0 → u .34
  [0, 0.2], // ┘
  [-12, 0.6], // ┐
  [-34, 1.3], // │ 左向螺旋爬升（屏在直道上，螺旋绕向外侧）
  [-34, 1.3],
  [-24, 1.2], // ┘ → u .542 出螺旋
  [-4, 0.8],
  [0, 0.4], // ┐ station-2 高架直道 站屏 #1 → u .59
  [0, 0.3], // ┘
  [10, -1.2], // ┐ 右向长降
  [34, -2.0],
  [34, -1.6],
  [10, -0.4], // ┘ → u .792
  [0, -0.2], // ┐ station-3 贴地直道 站屏 #2 → u .87
  [0, 0.6], // ┘
  [0, 1.2], // 终点制动上坡
  [0, 1.4],
];
const START: readonly [number, number, number] = [0, 1.2, 13];

function buildCurve() {
  let [x, y, z] = START;
  let hdg = -90; // deg，-90 = 沿 -z 前进
  const pts = [new THREE.Vector3(x, y, z)];
  for (const [dHdg, dY] of PLAN) {
    hdg += dHdg;
    const r = THREE.MathUtils.degToRad(hdg);
    x += Math.cos(r) * SEG;
    z += Math.sin(r) * SEG;
    y = Math.max(y + dY, 0.4);
    pts.push(new THREE.Vector3(x, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  // u 必须按弧长走：滚动进度是线性的，等弧长才等速
  curve.arcLengthDivisions = 2400;
  return curve;
}

const GROUND_Y = -3.4;
/** 园区（轨道包围盒）中心：远景环与 reduced-motion 全景机位都以它为基准。 */
function parkCenter(curve: THREE.CatmullRomCurve3) {
  const box = new THREE.Box3().setFromPoints(curve.getPoints(240));
  const size = box.getSize(new THREE.Vector3());
  return { center: box.getCenter(new THREE.Vector3()), size };
}
/** 三块屏立在直道末端（与 SECTION_WINDOWS 的区间中点对齐，见 .design-qa 验算）。 */
const STATION_U = [0.34, 0.59, 0.87];
const STATION_UP = 1.7;
const BOARD_W = 5.8;

/* ================= 轨道 ================= */

function Track({ mobile }: { mobile: boolean }) {
  const curve = useMemo(buildCurve, []);
  const maxAniso = useThree((s) => s.gl.capabilities.getMaxAnisotropy());
  const rail = useMemo(() => {
    const t = railTexture();
    // 约每 2.2 单位一段红白：太空会读不出「轨道」，太密会远处闪烁
    t.repeat.set(mobile ? 40 : 56, 1);
    t.anisotropy = Math.min(8, maxAniso);
    return t;
  }, [mobile, maxAniso]);
  const seg = mobile ? 140 : 300;
  const radial = mobile ? 5 : 9;
  const tube = useMemo(
    () => new THREE.TubeGeometry(curve, seg, 0.34, radial, false),
    [curve, seg, radial],
  );
  const outline = useMemo(
    () => new THREE.TubeGeometry(curve, seg, 0.46, Math.max(radial - 2, 4), false),
    [curve, seg, radial],
  );
  useEffect(
    () => () => {
      tube.dispose();
      outline.dispose();
      rail.dispose();
    },
    [tube, outline, rail],
  );

  const sleeperCount = mobile ? 26 : 54;
  const postCount = mobile ? 8 : 16;
  const sleepers = useRef<THREE.InstancedMesh>(null);
  const posts = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const frames = curve.computeFrenetFrames(seg, false);
    const mat = new THREE.Matrix4();
    const basis = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const tan = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const one = new THREE.Vector3(1, 1, 1);

    const sleeper = sleepers.current;
    if (sleeper) {
      for (let i = 0; i < sleeperCount; i += 1) {
        const u = clamp(i / (sleeperCount - 1), 0, 0.9995);
        curve.getPointAt(u, pos);
        curve.getTangentAt(u, tan);
        const k = clamp(Math.round(u * seg), 0, seg);
        basis.makeBasis(frames.binormals[k], frames.normals[k], tan.normalize());
        quat.setFromRotationMatrix(basis);
        mat.compose(pos, quat, one);
        sleeper.setMatrixAt(i, mat);
      }
      sleeper.instanceMatrix.needsUpdate = true;
    }

    const post = posts.current;
    if (post) {
      for (let i = 0; i < postCount; i += 1) {
        const u = clamp(0.06 + (i / (postCount - 1)) * 0.93, 0, 0.9995);
        curve.getPointAt(u, pos);
        const h = Math.max(pos.y - GROUND_Y, 0.6);
        mat.makeScale(1, h, 1);
        mat.setPosition(pos.x, pos.y - h / 2, pos.z);
        post.setMatrixAt(i, mat);
      }
      post.instanceMatrix.needsUpdate = true;
    }
  }, [curve, seg, sleeperCount, postCount]);

  return (
    <group>
      <mesh geometry={tube}>
        <meshBasicMaterial map={rail} toneMapped={false} />
      </mesh>
      {/* 硬边描边：反壳（背面渲染一圈 #0A1410） */}
      <mesh geometry={outline}>
        <meshBasicMaterial color={C.edge} side={THREE.BackSide} toneMapped={false} />
      </mesh>
      <instancedMesh ref={sleepers} args={[undefined, undefined, sleeperCount]}>
        <boxGeometry args={[2.2, 0.13, 0.34]} />
        <meshBasicMaterial color={C.cream} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={posts} args={[undefined, undefined, postCount]}>
        <boxGeometry args={[0.16, 1, 0.16]} />
        <meshBasicMaterial color={C.edge} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

/* ================= 缓动丘陵 ================= */

function Terrain({ mobile }: { mobile: boolean }) {
  const curve = useMemo(buildCurve, []);
  const dots = useMemo(() => halftoneTexture(mobile ? 16 : 11, 2.4), [mobile]);
  const sparse = useMemo(() => halftoneTexture(26, 1.7), []);
  useEffect(() => {
    dots.repeat.set(14, 14);
    sparse.repeat.set(8, 4);
  }, [dots, sparse]);
  useEffect(
    () => () => {
      dots.dispose();
      sparse.dispose();
    },
    [dots, sparse],
  );

  // 轨道在水平面上绕了一圈，所以远景必须是「环」，不能只堆在 -z 方向
  const park = useMemo(() => parkCenter(curve), [curve]);
  const radius = Math.max(park.size.x, park.size.z) * 0.5;
  const ring = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + 0.2;
        const r = radius * (i % 2 === 0 ? 1.9 : 2.5);
        const pos = new THREE.Vector3(
          park.center.x + Math.cos(a) * r,
          GROUND_Y + (i % 2 === 0 ? 13 : 19),
          park.center.z + Math.sin(a) * r,
        );
        const quat = new THREE.Quaternion().setFromRotationMatrix(
          // 相机约定 z = eye - target → (center, pos) 才让剪影牌面朝圆心
          new THREE.Matrix4().lookAt(park.center, pos, new THREE.Vector3(0, 1, 0)),
        );
        return { pos, quat, key: i };
      }),
    [park, radius],
  );
  const ground = Math.max(park.size.x, park.size.z) * 3.2;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[park.center.x, GROUND_Y, park.center.z]}>
        <planeGeometry args={[ground, ground]} />
        <meshBasicMaterial color={C.nightLift} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[park.center.x, GROUND_Y + 0.02, park.center.z]}>
        <planeGeometry args={[ground, ground]} />
        <meshBasicMaterial
          map={dots}
          transparent
          opacity={0.45}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* 丘陵剪影一圈：网点即明暗，纯色即体积 */}
      {ring.map((h) => (
        <mesh key={h.key} position={h.pos} quaternion={h.quat}>
          <planeGeometry args={[96, h.key % 2 === 0 ? 32 : 44]} />
          <meshBasicMaterial
            map={h.key % 2 === 0 ? dots : sparse}
            transparent
            opacity={h.key % 2 === 0 ? 0.3 : 0.44}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ================= 三座站台 billboard ================= */

type Media = { kind: 'video'; el: HTMLVideoElement } | { kind: 'image'; src: string };

function makeVideo(src: string) {
  const el = document.createElement('video');
  el.src = src;
  el.loop = true;
  el.muted = true;
  el.playsInline = true;
  el.preload = 'auto';
  void el.play().catch(() => undefined);
  return el;
}

/** HEAD 探测：拿到 video/* 才用视频纹理，否则回落 /images/*.jpg，绝不留空层或 404。 */
function useStationMedia(preferVideo: boolean): Media[] {
  const [media, setMedia] = useState<Media[]>(() =>
    projects.map((p) => ({ kind: 'image', src: p.image })),
  );

  useEffect(() => {
    if (!preferVideo) return;
    let alive = true;
    void Promise.all(
      projects.map((p) =>
        fetch(p.hoverVideo ?? '', { method: 'HEAD' })
          .then((res) =>
            res.ok && (res.headers.get('content-type') ?? '').startsWith('video/')
              ? (p.hoverVideo as string)
              : null,
          )
          .catch(() => null),
      ),
    ).then((urls) => {
      if (!alive) return;
      setMedia(
        urls.map((u, i) =>
          u ? { kind: 'video', el: makeVideo(u) } : { kind: 'image', src: projects[i].image },
        ),
      );
    });
    return () => {
      alive = false;
    };
  }, [preferVideo]);

  return media;
}

function useImgTexture(src: string | null) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!src) {
      setTex(null);
      return;
    }
    let alive = true;
    let loaded: THREE.Texture | null = null;
    new THREE.TextureLoader().load(
      src,
      (t) => {
        loaded = t;
        if (!alive) {
          t.dispose();
          return;
        }
        t.colorSpace = THREE.SRGBColorSpace;
        setTex(t);
      },
      undefined,
      () => {
        alive && setTex(null);
      },
    );
    return () => {
      alive = false;
      loaded?.dispose();
    };
  }, [src]);
  return tex;
}

function StationScreens({ media, mobile }: { media: Media[]; mobile: boolean }) {
  const curve = useMemo(buildCurve, []);
  const placed = useMemo(
    () =>
      media.map((_, i) => {
        const u = STATION_U[i];
        const tangent = curve.getTangentAt(u);
        const right = new THREE.Vector3()
          .crossVectors(tangent, new THREE.Vector3(0, 1, 0))
          .normalize();
        const pos = curve
          .getPointAt(u)
          .add(right.multiplyScalar(mobile ? 3.7 : 4.9))
          .add(new THREE.Vector3(0, STATION_UP, 0));
        // 面向「正在进站的乘客」：锁定对准上游来车方向，而不是每帧跟镜头转。
        const aim = curve
          .getPointAt(Math.max(u - 0.1, 0.001))
          .add(new THREE.Vector3(0, 1, 0));
        const h = (mobile ? BOARD_W * 0.76 : BOARD_W) * (9 / 16);
        return {
          pos,
          // Matrix4.lookAt 是相机约定（z = eye - target）：eye=aim / target=pos
          // 才能得到「+Z 指向进站方向」的朝向；反了屏体就背对乘客、被背面剔除。
          quat: new THREE.Quaternion().setFromRotationMatrix(
            new THREE.Matrix4().lookAt(aim, pos, new THREE.Vector3(0, 1, 0)),
          ),
          legH: Math.max(pos.y - h / 2 - GROUND_Y, 1.2),
        };
      }),
    [curve, media.length, mobile],
  );

  return (
    <group>
      {placed.map((st, i) => (
        <group key={projects[i].index} position={st.pos} quaternion={st.quat}>
          <Screen project={projects[i]} media={media[i]} mobile={mobile} legH={st.legH} />
        </group>
      ))}
    </group>
  );
}

function Screen({
  project,
  media,
  mobile,
  legH,
}: {
  project: (typeof projects)[number];
  media: Media;
  mobile: boolean;
  legH: number;
}) {
  const w = mobile ? BOARD_W * 0.76 : BOARD_W;
  const h = w * (9 / 16);

  const videoTex = useMemo(() => {
    if (media.kind !== 'video') return null;
    const t = new THREE.VideoTexture(media.el);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [media]);
  const imgTex = useImgTexture(media.kind === 'image' ? media.src : null);
  const maxAniso = useThree((s) => s.gl.capabilities.getMaxAnisotropy());
  const sign = useMemo(() => {
    const t = signTexture(project.name, project.category, `NO.${project.index}`);
    t.anisotropy = Math.min(8, maxAniso);
    return t;
  }, [project.name, project.category, project.index, maxAniso]);

  useEffect(
    () => () => {
      videoTex?.dispose();
      if (media.kind === 'video') media.el.pause();
    },
    [videoTex, media],
  );
  useEffect(() => () => sign.dispose(), [sign]);

  const map = videoTex ?? imgTex;

  return (
    <group>
      {/* 背板：深色硬边，让屏体在松绿夜空里有轮廓；双面，绕到背面也是实心牌 */}
      <mesh position={[0, 0, -0.09]}>
        <planeGeometry args={[w + 1, h + 1.5]} />
        <meshBasicMaterial color={C.edge} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={map ?? undefined} color={map ? 0xffffff : C.night} toneMapped={false} />
      </mesh>
      {/* 漆面金属框：四根纯色硬边条 */}
      <mesh position={[0, h / 2 + 0.17, -0.05]}>
        <boxGeometry args={[w + 0.52, 0.34, 0.18]} />
        <meshBasicMaterial color={C.candy} toneMapped={false} />
      </mesh>
      <mesh position={[0, -h / 2 - 0.17, -0.05]}>
        <boxGeometry args={[w + 0.52, 0.34, 0.18]} />
        <meshBasicMaterial color={C.candyShade} toneMapped={false} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * (w + 0.35)) / 2, 0, -0.05]}>
          <boxGeometry args={[0.34, h + 0.68, 0.18]} />
          <meshBasicMaterial color={C.candy} toneMapped={false} />
        </mesh>
      ))}
      {/* 站名牌：紧贴屏体上框，像真站牌那样压在牌体上 */}
      <mesh position={[0, h / 2 + 0.75, 0.02]}>
        <planeGeometry args={[w * 0.86, w * 0.86 * (200 / 1024)]} />
        <meshBasicMaterial map={sign} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {/* 支腿：从屏体下沿一直立到地面（高度按站台实际海拔算） */}
      <mesh position={[0, -h / 2 - legH / 2, -0.1]}>
        <boxGeometry args={[0.22, legH, 0.22]} />
        <meshBasicMaterial color={C.edge} toneMapped={false} />
      </mesh>
      <mesh position={[0, -h / 2 - legH, -0.1]}>
        <boxGeometry args={[1.2, 0.18, 1.2]} />
        <meshBasicMaterial color={C.candyShade} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ================= 相机：滚动 hijack ================= */

const worldUp = new THREE.Vector3(0, 1, 0);

function CoasterRig({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const curve = useMemo(buildCurve, []);
  const park = useMemo(() => parkCenter(curve), [curve]);
  const { camera, invalidate } = useThree();
  const look = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());
  const side = useRef(new THREE.Vector3());
  const up = useRef(new THREE.Vector3());
  const tan = useRef(new THREE.Vector3());
  const tanAhead = useRef(new THREE.Vector3());
  const scratch = useRef(new THREE.Vector3());
  const settled = useRef(false);
  const lastP = useRef(0);
  const baseFov = mobile ? 66 : 56;
  const eye = mobile ? 0.95 : 1.18;

  useEffect(() => {
    settled.current = false;
    invalidate();
  }, [reduced, mobile, invalidate]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const ease = 1 - Math.exp(-5.2 * dt);
    const p = reduced ? 1 : clamp(coaster.progress, 0, 1);

    // 速度感：进度差分 → 归一化 → FOV 上限 +6°
    const inst = Math.abs(p - lastP.current) / Math.max(dt, 0.001);
    lastP.current = p;
    const speed = clamp(inst * (mobile ? 2.4 : 1.8), 0, 1);

    if (reduced) {
      // 冻结在终点全景：升到园区中心上空，俯视整条轨道 + 三块站屏
      target.current.set(
        park.center.x + 5,
        park.center.y + 24,
        park.center.z + Math.max(park.size.x, park.size.z) * 0.62,
      );
      look.current.copy(park.center).add(new THREE.Vector3(0, -3, 0));
      camera.up.copy(worldUp);
    } else {
      const u = clamp(p, 0, 0.985);
      const uAhead = clamp(u + 0.05, 0, 0.999);

      curve.getPointAt(u, target.current);
      curve.getPointAt(uAhead, look.current);
      curve.getTangentAt(u, tan.current);
      curve.getTangentAt(uAhead, tanAhead.current);

      /* 轨道局部正交基：side = tan × 世界上方向，up = side × tan。
         相机不是骑在管道中心线上，而是坐在轨道上方的「乘客眼位」——
         否则 TubeGeometry 的内壁会糊满整屏，站台屏也永远进不了画。 */
      side.current.crossVectors(tan.current, worldUp);
      if (side.current.lengthSq() < 1e-6) side.current.set(1, 0, 0);
      side.current.normalize();
      up.current.crossVectors(side.current, tan.current).normalize();

      // 进弯侧倾：用相邻两切线的带符号夹角近似曲率，限幅 ±7°，
      // 世界 up 与 lookAt 共用同一个 up，因此倾斜是有界的、不晕。
      const yaw = Math.atan2(
        scratch.current.copy(tan.current).cross(tanAhead.current).dot(worldUp),
        tan.current.dot(tanAhead.current),
      );
      up.current.applyAxisAngle(tan.current, clamp(yaw * 5, -0.122, 0.122));

      target.current.addScaledVector(up.current, eye);
      // 视线落在前方轨道略下方：轨道向远处收缩，天际与丘陵留在上半屏
      look.current.addScaledVector(up.current, 0.18);
    }

    if (!settled.current) {
      camera.position.copy(target.current);
      settled.current = true;
    } else {
      camera.position.lerp(target.current, ease);
    }
    camera.lookAt(look.current);

    if (reduced) return;

    const k = THREE.MathUtils.degToRad(2);
    camera.rotateY(-coaster.pointerX * k);
    camera.rotateX(-coaster.pointerY * k * 0.6);

    const cam = camera as THREE.PerspectiveCamera;
    const fov = baseFov + speed * 6;
    if (Math.abs(cam.fov - fov) > 0.02) {
      cam.fov += (fov - cam.fov) * ease;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

/* ================= 入口 ================= */

export function CoasterCanvas({
  reduced,
  mobile,
  boarded,
}: {
  reduced: boolean;
  mobile: boolean;
  boarded: boolean;
}) {
  const [pageHidden, setPageHidden] = useState(false);
  const media = useStationMedia(!reduced && !mobile);

  useEffect(() => {
    const onVis = () => setPageHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (coarse) return;
    const onMove = (e: PointerEvent) => {
      coaster.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      coaster.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  // 出视口 / 隐藏页 / 尚未登车 → frameloop='never'，一帧都不多画。
  const running = boarded && !pageHidden;
  const frameloop = !running ? 'never' : reduced ? 'demand' : 'always';

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 2.4, 13], fov: 56, near: 0.1, far: 340 }}
        dpr={mobile ? [1, 1.5] : [1, 2]}
        frameloop={frameloop}
        gl={{ antialias: !mobile, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[C.night]} />
        <fog attach="fog" args={[C.night, mobile ? 30 : 45, mobile ? 140 : 200]} />
        <CoasterRig reduced={reduced} mobile={mobile} />
        <Terrain mobile={mobile} />
        <Track mobile={mobile} />
        <StationScreens media={media} mobile={mobile} />
      </Canvas>
    </div>
  );
}
