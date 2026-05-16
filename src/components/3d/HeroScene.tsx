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
    if (coreRef.current)    coreRef.current.scale.setScalar(1 + Math.sin(t * 2.6) * 0.09);
    if (corona1Ref.current) corona1Ref.current.scale.setScalar(1 + Math.sin(t * 1.8 + 1.2) * 0.14);
    if (corona2Ref.current) corona2Ref.current.scale.setScalar(1 + Math.sin(t * 1.3 + 2.4) * 0.18);
  });

  return (
    <group>
      {/* Solid bright core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial
          color="#FF3050"
          emissive="#FF2040"
          emissiveIntensity={12}
        />
      </mesh>

      {/* Corona 1 — tight hot halo */}
      <mesh ref={corona1Ref}>
        <sphereGeometry args={[0.50, 24, 24]} />
        <meshStandardMaterial
          color="#FF1020"
          emissive="#FF1020"
          emissiveIntensity={6}
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Corona 2 — mid diffuse ring */}
      <mesh ref={corona2Ref}>
        <sphereGeometry args={[0.84, 20, 20]} />
        <meshStandardMaterial
          color="#D81829"
          emissive="#D81829"
          emissiveIntensity={3}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Corona 3 — outer atmosphere */}
      <mesh>
        <sphereGeometry args={[1.30, 16, 16]} />
        <meshStandardMaterial
          color="#8B0000"
          emissive="#D81829"
          emissiveIntensity={1.5}
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
        {/* Outer dodecahedron — crimson glow wireframe */}
        <mesh>
          <dodecahedronGeometry args={[2.5, 0]} />
          <meshStandardMaterial
            color="#FF2040"
            emissive="#FF1830"
            emissiveIntensity={4}
            wireframe
            transparent
            opacity={0.90}
          />
        </mesh>

        {/* Ghost halo layer — broadens the bloom halo */}
        <mesh>
          <dodecahedronGeometry args={[2.56, 0]} />
          <meshStandardMaterial
            color="#D81829"
            emissive="#D81829"
            emissiveIntensity={2}
            wireframe
            transparent
            opacity={0.28}
          />
        </mesh>

        <group ref={innerRef}>
          {/* Inner icosahedron — teal glow wireframe */}
          <mesh>
            <icosahedronGeometry args={[1.45, 0]} />
            <meshStandardMaterial
              color="#00FFE8"
              emissive="#00BDAC"
              emissiveIntensity={3}
              wireframe
              transparent
              opacity={0.75}
            />
          </mesh>

          {/* Ghost halo for inner mesh */}
          <mesh>
            <icosahedronGeometry args={[1.50, 0]} />
            <meshStandardMaterial
              color="#00BDAC"
              emissive="#00BDAC"
              emissiveIntensity={1.5}
              wireframe
              transparent
              opacity={0.20}
            />
          </mesh>

          <SunCore />
        </group>
      </group>

      {/* Crimson sparkles */}
      <Sparkles count={50} size={1.0} scale={[10, 8, 6]} speed={0.22} color="#FF2040" opacity={0.45} />
      {/* Teal sparkles */}
      <Sparkles count={22} size={0.7} scale={[7, 5, 4]}  speed={0.14} color="#00BDAC" opacity={0.30} />

      {/* Lights that drive the emissive interplay */}
      <pointLight position={[0, 0, 0]} color="#FF2040" intensity={12} distance={9}  />
      <pointLight position={[0, 0, 3]} color="#D81829" intensity={5}  distance={14} />
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
        <Bloom
          intensity={2.2}
          luminanceThreshold={0.05}
          luminanceSmoothing={0.85}
          mipmapBlur
          radius={0.7}
        />
      </EffectComposer>
    </Canvas>
  );
}
