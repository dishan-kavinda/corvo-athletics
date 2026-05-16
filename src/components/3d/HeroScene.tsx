'use client';

import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

function SunCore() {
  const coreRef    = useRef<THREE.Mesh>(null);
  const corona1Ref = useRef<THREE.Mesh>(null);
  const corona2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    /* Slow, heavy pulse — like a reactor heartbeat */
    if (coreRef.current)    coreRef.current.scale.setScalar(1 + Math.sin(t * 1.4) * 0.06);
    if (corona1Ref.current) corona1Ref.current.scale.setScalar(1 + Math.sin(t * 1.0 + 1.0) * 0.11);
    if (corona2Ref.current) corona2Ref.current.scale.setScalar(1 + Math.sin(t * 0.7 + 2.0) * 0.16);
  });

  return (
    <group>
      {/* Dense red core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.17, 32, 32]} />
        <meshStandardMaterial
          color="#CC0000"
          emissive="#CC0000"
          emissiveIntensity={18}
        />
      </mesh>

      {/* Corona 1 — tight inner halo */}
      <mesh ref={corona1Ref}>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial
          color="#AA0000"
          emissive="#AA0000"
          emissiveIntensity={8}
          transparent
          opacity={0.28}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Corona 2 — mid power bloom */}
      <mesh ref={corona2Ref}>
        <sphereGeometry args={[0.60, 20, 20]} />
        <meshStandardMaterial
          color="#880000"
          emissive="#880000"
          emissiveIntensity={4}
          transparent
          opacity={0.14}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Corona 3 — deep outer energy field */}
      <mesh>
        <sphereGeometry args={[1.0, 16, 16]} />
        <meshStandardMaterial
          color="#550000"
          emissive="#990000"
          emissiveIntensity={2}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

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
        {/* Outer dodecahedron — subtle crimson wireframe, lit by the core */}
        <mesh>
          <dodecahedronGeometry args={[2.5, 0]} />
          <meshStandardMaterial
            color="#D81829"
            emissive="#D81829"
            emissiveIntensity={1.2}
            wireframe
            transparent
            opacity={0.72}
          />
        </mesh>

        <group ref={innerRef}>
          {/* Inner icosahedron — subtle teal wireframe */}
          <mesh>
            <icosahedronGeometry args={[1.45, 0]} />
            <meshStandardMaterial
              color="#00BDAC"
              emissive="#00BDAC"
              emissiveIntensity={1.0}
              wireframe
              transparent
              opacity={0.55}
            />
          </mesh>

          <SunCore />
        </group>
      </group>

      <Sparkles count={40} size={0.8} scale={[10, 8, 6]} speed={0.18} color="#CC0000" opacity={0.35} />
      <Sparkles count={18} size={0.6} scale={[7,  5, 4]} speed={0.12} color="#00BDAC" opacity={0.22} />

      {/* Core reactor light — bleeds red onto surrounding wireframe */}
      <pointLight position={[0, 0, 0]} color="#CC0000" intensity={18} distance={7}  />
      <pointLight position={[0, 0, 0]} color="#880000" intensity={8}  distance={14} />
    </>
  );
}

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
        {/* High threshold — only the reactor core blooms hard, wireframe gets a whisper */}
        <Bloom
          intensity={1.6}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.90}
          mipmapBlur
          radius={0.85}
        />
      </EffectComposer>
    </Canvas>
  );
}
