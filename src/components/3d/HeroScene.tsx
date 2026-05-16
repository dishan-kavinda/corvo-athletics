'use client';

import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ── Power Core ─────────────────────────────────────────
   Single sphere. Custom shader computes dot(normal, viewDir)
   so brightness physically falls off from centre to edge —
   the classic "shiny glossy sphere" look without any layers.
   Centre: hot orange-white. Mid: crimson. Edge: near-black.
──────────────────────────────────────────────────────── */
function PowerCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vNormal       = normalize(normalMatrix * normal);
            vec4 mvPos    = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPos.xyz;
            gl_Position   = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          varying vec3  vNormal;
          varying vec3  vViewPosition;

          void main() {
            vec3  V     = normalize(vViewPosition);
            float NdotV = clamp(dot(vNormal, V), 0.0, 1.0);

            /* Slow reactor heartbeat */
            float pulse = 1.0 + sin(uTime * 1.3) * 0.055;
            float core  = pow(NdotV, 1.5) * pulse;

            /* Colour stops — dark edge → crimson mid → hot centre */
            vec3 edgeCol = vec3(0.18, 0.0,  0.01);   /* near-black red  */
            vec3 midCol  = vec3(0.86, 0.04, 0.08);   /* crimson         */
            vec3 hotCol  = vec3(1.00, 0.82, 0.58);   /* hot orange-white */

            vec3 col = mix(edgeCol, midCol, smoothstep(0.0,  0.42, NdotV));
                 col = mix(col,     hotCol, smoothstep(0.60, 1.0,  NdotV));

            /* Multiply by intensity: centre is very bright for Bloom pickup */
            col *= (0.28 + core * 2.6);

            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    []
  );

  useFrame(({ clock }) => {
    if (meshRef.current)
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value =
        clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[0.22, 64, 64]} />
    </mesh>
  );
}

/* ── Pentagon4D ─────────────────────────────────────── */
function Pentagon4D() {
  const outerRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const mouse    = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ clock }) => {
    if (!outerRef.current || !innerRef.current) return;
    const t = clock.getElapsedTime();
    const { x, y } = mouse.current;

    const targetY = x * Math.PI * 0.75;
    const targetX = y * Math.PI * 0.40;
    outerRef.current.rotation.y += (targetY - outerRef.current.rotation.y) * 0.055;
    outerRef.current.rotation.x += (targetX - outerRef.current.rotation.x) * 0.055;
    outerRef.current.rotation.z  = t * 0.07;

    innerRef.current.rotation.y = -t * 0.24;
    innerRef.current.rotation.x =  t * 0.18;
    innerRef.current.rotation.z = -t * 0.10;
  });

  return (
    <>
      <group ref={outerRef}>
        {/* Outer dodecahedron — dimly lit by core */}
        <mesh>
          <dodecahedronGeometry args={[2.5, 0]} />
          <meshStandardMaterial
            color="#D81829"
            emissive="#D81829"
            emissiveIntensity={1.1}
            wireframe
            transparent
            opacity={0.70}
          />
        </mesh>

        <group ref={innerRef}>
          {/* Inner icosahedron */}
          <mesh>
            <icosahedronGeometry args={[1.45, 0]} />
            <meshStandardMaterial
              color="#00BDAC"
              emissive="#00BDAC"
              emissiveIntensity={0.9}
              wireframe
              transparent
              opacity={0.52}
            />
          </mesh>

          <PowerCore />
        </group>
      </group>

      <Sparkles count={40} size={0.8} scale={[10, 8, 6]} speed={0.18} color="#CC0000" opacity={0.32} />
      <Sparkles count={18} size={0.6} scale={[7,  5, 4]} speed={0.12} color="#00BDAC" opacity={0.20} />

      {/* Core light bleeds red onto the wireframe cage */}
      <pointLight position={[0, 0, 0]} color="#CC0000" intensity={16} distance={7}  />
      <pointLight position={[0, 0, 0]} color="#880000" intensity={7}  distance={14} />
    </>
  );
}

/* ── Scene ──────────────────────────────────────────── */
export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 48 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <Pentagon4D />

      <EffectComposer>
        {/* Threshold at 0.5 — only the hot centre blooms, wireframe barely registers */}
        <Bloom
          intensity={1.8}
          luminanceThreshold={0.50}
          luminanceSmoothing={0.88}
          mipmapBlur
          radius={0.80}
        />
      </EffectComposer>
    </Canvas>
  );
}
