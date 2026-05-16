'use client';

import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/* ── Pentagon4D ─────────────────────────────────────
   Outer  : dodecahedron (12 pentagonal faces)  — crimson
   Inner  : icosahedron counter-rotating        — teal
   Effect : both track mouse across full window,
            inner counter-spin creates 4D illusion
────────────────────────────────────────────────── */

function Pentagon4D() {
  const outerRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const mouse    = useRef({ x: 0, y: 0 });

  /* Track mouse across the entire window */
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

    /* Smooth lerp toward mouse-driven orientation */
    const targetY = x * Math.PI * 0.75;
    const targetX = y * Math.PI * 0.40;
    outerRef.current.rotation.y += (targetY - outerRef.current.rotation.y) * 0.055;
    outerRef.current.rotation.x += (targetX - outerRef.current.rotation.x) * 0.055;
    outerRef.current.rotation.z  = t * 0.07;          /* slow base roll */

    /* Inner shape: independent counter-spin = "4D" depth */
    innerRef.current.rotation.y = -t * 0.24;
    innerRef.current.rotation.x =  t * 0.18;
    innerRef.current.rotation.z = -t * 0.10;
  });

  return (
    <>
      {/* ── Outer: dodecahedron (pentagonal faces) ── */}
      <group ref={outerRef}>
        <mesh>
          <dodecahedronGeometry args={[2.5, 0]} />
          <meshBasicMaterial
            color="#D81829"
            wireframe
            transparent
            opacity={0.72}
          />
        </mesh>

        {/* ── Inner: icosahedron counter-rotating ─── */}
        <group ref={innerRef}>
          <mesh>
            <icosahedronGeometry args={[1.45, 0]} />
            <meshBasicMaterial
              color="#00BDAC"
              wireframe
              transparent
              opacity={0.52}
            />
          </mesh>

          {/* Glowing core point */}
          <mesh>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshStandardMaterial
              color="#D81829"
              emissive="#D81829"
              emissiveIntensity={6}
            />
          </mesh>
        </group>
      </group>

      {/* ── Ambient sparkles ────────────────────── */}
      <Sparkles
        count={45}
        size={0.9}
        scale={[10, 8, 6]}
        speed={0.22}
        color="#D81829"
        opacity={0.30}
      />
      <Sparkles
        count={20}
        size={0.65}
        scale={[7, 5, 4]}
        speed={0.14}
        color="#00BDAC"
        opacity={0.24}
      />

      {/* Core glow point light */}
      <pointLight position={[0, 0, 0]} color="#D81829" intensity={3} distance={5} />
    </>
  );
}

/* ── Exported scene ─────────────────────────────── */

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 48 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <Pentagon4D />
    </Canvas>
  );
}
