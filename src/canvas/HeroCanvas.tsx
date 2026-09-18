import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { scrollState } from '../state/scroll';

const SLICE_W = 1.7;
const SLICE_H = 1.34;
const SLICE_D = 0.14;

/* 3D 材质/灯光色必须与 @theme 同源，避免字面量漂移 */
function themeColor(name: string, fallback: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function useSlices() {
  const source = useLoader(THREE.TextureLoader, '/images/hero-bust.jpg');
  return useMemo(() => {
    source.colorSpace = THREE.SRGBColorSpace;
    const bodyColor = themeColor('--color-surface', '#1a1817');
    return [0, 1, 2].map((i) => {
      const face = source.clone();
      face.needsUpdate = true;
      face.repeat.set(1, 1 / 3);
      face.offset.set(0, 1 - (i + 1) / 3);
      const body = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.9 });
      const front = new THREE.MeshStandardMaterial({ map: face, roughness: 0.86 });
      return { materials: [body, body, body, body, front, body], face };
    });
  }, [source]);
}

function SlicedPortrait({ reducedMotion }: { reducedMotion: boolean }) {
  const slices = useSlices();
  const { size } = useThree();
  const group = useRef<THREE.Group>(null);
  const refs = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];

  useFrame((st, delta) => {
    const g = group.current;
    if (!g) return;
    const p = reducedMotion ? 0 : scrollState.heroProgress;
    const ease = 1 - Math.exp(-5 * delta);
    const pointerX = reducedMotion ? 0 : scrollState.pointerX;
    const pointerY = reducedMotion ? 0 : scrollState.pointerY;
    const compact = size.width < 900;
    // 桌面正文列被 240px 脊轨右移，头像同步右移并略缩，避免压住标题
    const baseX = compact ? 1.12 : 1.8;
    const baseY = compact ? 0.74 : 0.1;
    const targetScale = compact ? 0.5 : 0.84;

    g.rotation.y += (-0.42 + p * 0.9 + pointerX * 0.16 - g.rotation.y) * ease;
    g.rotation.x += (pointerY * -0.07 - g.rotation.x) * ease;
    g.position.x += (baseX - g.position.x) * ease;
    g.position.y += (baseY + 0.1 - p * 0.5 - g.position.y) * ease;
    g.scale.x += (targetScale - g.scale.x) * ease;
    g.scale.y = g.scale.z = g.scale.x;

    const spread = 0.1 + p * 0.46;
    refs.forEach((ref, i) => {
      const mesh = ref.current;
      if (!mesh) return;
      const centered = 1 - i;
      mesh.position.y += (centered * (SLICE_H * 0.5 + spread) - mesh.position.y) * ease;
      mesh.position.z += ((i === 1 ? 0.22 : -0.1) * (1 + p) - mesh.position.z) * ease;
      mesh.rotation.y += (centered * -0.06 * p - mesh.rotation.y) * ease;
    });

    st.camera.position.z += (5.1 - p * 1.5 - st.camera.position.z) * ease;
  });

  return (
    <group ref={group} position={[1.8, 0.1, -0.6]}>
      {slices.map((slice, i) => (
        <mesh key={i} ref={refs[i]} material={slice.materials} castShadow>
          <boxGeometry args={[SLICE_W, SLICE_H, SLICE_D]} />
        </mesh>
      ))}
    </group>
  );
}

function VideoPlane({ src }: { src: string }) {
  const plane = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const texture = useMemo(() => {
    const el = document.createElement('video');
    el.src = src;
    el.loop = true;
    el.muted = true;
    el.playsInline = true;
    el.preload = 'auto';
    void el.play().catch(() => undefined);
    const map = new THREE.VideoTexture(el);
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, [src]);

  useEffect(() => {
    const el = texture.image as HTMLVideoElement;
    return () => {
      el.pause();
      texture.dispose();
    };
  }, [texture]);

  useFrame((_, delta) => {
    texture.offset.x = scrollState.heroProgress * 0.05;
    texture.offset.y = scrollState.heroProgress * 0.02;
    // Portrait only samples a narrow strip of the plane, so pan the bright subject out of the copy column.
    const targetX = size.width < 900 ? 6.5 : 0;
    const mesh = plane.current;
    if (mesh) mesh.position.x += (targetX - mesh.position.x) * (1 - Math.exp(-5 * delta));
  });

  return (
    <mesh ref={plane} position={[0, 0, -7]}>
      <planeGeometry args={[30, 17]} />
      {/* 压暗到环境光级别：封面标题列右移后会与视频亮部重叠 */}
      <meshBasicMaterial map={texture} color={themeColor('--canvas-video-dim', '#555555')} toneMapped={false} />
    </mesh>
  );
}

function mediaExists(src: string, set: (v: boolean) => void) {
  fetch(src, { method: 'HEAD' })
    .then((res) => set(res.ok && (res.headers.get('content-type') ?? '').startsWith('video/')))
    .catch(() => set(false));
}

/* 封面随滚动离场：不透明区块压上来之前先淡掉，避免硬边切断头像 */
function CanvasFade() {
  const { gl } = useThree();
  useFrame(() => {
    const p = scrollState.heroProgress;
    gl.domElement.style.opacity = String(Math.min(Math.max(1 - (p - 0.2) / 0.35, 0), 1));
  });
  return null;
}

export function HeroCanvas({ reducedMotion }: { reducedMotion: boolean }) {
  const [heroVideo, setHeroVideo] = useState(false);
  const [inView, setInView] = useState(true);

  useEffect(() => mediaExists('/media/hero-loop.mp4', setHeroVideo), []);

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => window.removeEventListener('pointermove', onPointer);
  }, []);

  useEffect(() => {
    const onScroll = () => setInView(window.scrollY < window.innerHeight * 1.25);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Canvas
      aria-hidden
      role="presentation"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
      camera={{ position: [0, 0, 5.1], fov: 42 }}
      dpr={[1, 2]}
      frameloop={inView ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 5, 4]} intensity={1.7} />
      <directionalLight position={[-4, -1, 2]} intensity={0.35} color={themeColor('--color-verdigris', '#5e8c7f')} />
      <CanvasFade />
      <Suspense fallback={null}>
        {heroVideo ? <VideoPlane src="/media/hero-loop.mp4" /> : null}
        <SlicedPortrait reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
