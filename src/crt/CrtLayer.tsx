import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* three.js 自定义 shader：桶形畸变 + 扫描线 + 雪花噪点 + 轻微色散 + 暗角。
   纹理由屏幕内真实播放的 <video> / <img> 直接采样（VideoTexture / Texture），
   素材未投放时走 <img> 路径，探测失败时整层不挂载（CSS 扫描线兜底）。 */

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAG = /* glsl */ `
uniform sampler2D uTex;
uniform float uTime;
uniform float uAspect;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 barrel(vec2 uv, float amp) {
  vec2 c = uv - 0.5;
  c.x *= uAspect;
  float r2 = dot(c, c);
  return (c * (1.0 + amp * r2)) / uAspect + 0.5;
}

void main() {
  vec2 uv = barrel(vUv, 0.17);
  uv.x += 0.0011 * sin(uv.y * 150.0 + uTime * 3.0);

  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    gl_FragColor = vec4(0.043, 0.047, 0.039, 1.0);
    return;
  }

  float ca = 0.0013;
  vec3 col = vec3(
    texture2D(uTex, uv + vec2(ca, 0.0)).r,
    texture2D(uTex, uv).g,
    texture2D(uTex, uv - vec2(ca, 0.0)).b
  );

  col *= 0.84 + 0.16 * sin(uv.y * 780.0);

  float sweep = abs(fract(uv.y * 0.5 - uTime * 0.055) - 0.5);
  col += 0.05 * exp(-34.0 * sweep * sweep);

  col += (hash(uv * 320.0 + uTime * 19.0) - 0.5) * 0.085;

  vec2 q = vUv - 0.5;
  col *= 1.0 - 0.92 * dot(q, q);

  gl_FragColor = vec4(col, 1.0);
}
`;

let webglFlag: boolean | null = null;
export function hasWebGL() {
  if (webglFlag !== null) return webglFlag;
  try {
    const probe = document.createElement('canvas');
    webglFlag = Boolean(
      window.WebGLRenderingContext &&
        (probe.getContext('webgl2') ?? probe.getContext('webgl') ?? false),
    );
  } catch {
    webglFlag = false;
  }
  return webglFlag;
}

function Quad({ tex }: { tex: THREE.Texture }) {
  const { viewport } = useThree();
  const uniforms = useMemo(
    () => ({ uTex: { value: tex }, uTime: { value: 0 }, uAspect: { value: 1.6 } }),
    [tex],
  );

  useFrame((state, dt) => {
    uniforms.uTime.value = Math.min(uniforms.uTime.value + dt, 3600);
    uniforms.uAspect.value = state.viewport.height
      ? state.viewport.width / state.viewport.height
      : 1.6;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        depthWrite={false}
      />
    </mesh>
  );
}

export function CrtLayer({
  source,
  live,
}: {
  source: HTMLVideoElement | HTMLImageElement | null;
  live: boolean;
}) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const failed = useRef(false);

  useEffect(() => {
    const el = source;
    if (!el || failed.current || !hasWebGL()) return;

    let texture: THREE.Texture;
    try {
      texture =
        el instanceof HTMLVideoElement ? new THREE.VideoTexture(el) : new THREE.Texture(el);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
    } catch {
      failed.current = true;
      return;
    }

    setTex(texture);
    return () => {
      texture.dispose();
      setTex(null);
    };
  }, [source]);

  if (!tex) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ touchAction: 'pan-y' }}
    >
      <Canvas
        dpr={[1, 2]}
        frameloop={live ? 'always' : 'never'}
        gl={{ antialias: false, alpha: false, powerPreference: 'low-power', preserveDrawingBuffer: true }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <Quad tex={tex} />
      </Canvas>
    </div>
  );
}
