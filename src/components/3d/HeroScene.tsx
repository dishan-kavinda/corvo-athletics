'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* ── Wing geometry ──────────────────────────────────── */

function createWingShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.4, 0.3, 0.9, 0.8, 1.4, 1.05);
  shape.bezierCurveTo(1.85, 1.28, 2.32, 1.52, 2.82, 1.64);
  shape.bezierCurveTo(3.0, 1.72, 3.28, 1.62, 3.46, 1.44);
  shape.quadraticCurveTo(3.38, 0.94, 3.12, 0.86);
  shape.quadraticCurveTo(2.98, 0.70, 2.82, 0.62);
  shape.quadraticCurveTo(2.68, 0.50, 2.52, 0.42);
  shape.quadraticCurveTo(2.36, 0.30, 2.18, 0.22);
  shape.quadraticCurveTo(2.02, 0.14, 1.84, 0.08);
  shape.quadraticCurveTo(1.68, 0.04, 1.50, 0.02);
  shape.bezierCurveTo(1.2, -0.06, 0.8, -0.10, 0.45, -0.08);
  shape.quadraticCurveTo(0.18, -0.04, 0, 0);
  return shape;
}

/* ── Wing mesh ──────────────────────────────────────── */

function Wing({ flip = false, delay = 0 }: { flip?: boolean; delay?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const shape = createWingShape();
    return new THREE.ShapeGeometry(shape, 96);
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() + delay;
    groupRef.current.rotation.z = (flip ? 1 : -1) * (Math.sin(t * 0.9) * 0.06 + 0.12);
    groupRef.current.rotation.x = Math.sin(t * 0.5 + 1.2) * 0.04;
  });

  return (
    <group ref={groupRef} scale={[flip ? -1 : 1, 1, 1]}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color={new THREE.Color(0x020206)}
          roughness={0.08}
          metalness={0.0}
          sheen={2.0}
          sheenColor={new THREE.Color('#00BDAC')}
          sheenRoughness={0.06}
          clearcoat={0.6}
          clearcoatRoughness={0.03}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial color="#00BDAC" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

/* ── Raven body ─────────────────────────────────────── */

function Body() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.9) * 0.025;
  });

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x010108),
        roughness: 0.08,
        metalness: 0.0,
        sheen: 1.5,
        sheenColor: new THREE.Color('#00BDAC'),
        sheenRoughness: 0.08,
        clearcoat: 0.5,
      }),
    [],
  );

  return (
    <group ref={ref}>
      <mesh position={[0, -0.18, 0]} material={material}>
        <sphereGeometry args={[0.32, 20, 20]} />
      </mesh>
      <mesh position={[0.28, 0.1, 0]} rotation={[0, 0, -0.4]} material={material}>
        <cylinderGeometry args={[0.12, 0.18, 0.32, 16]} />
      </mesh>
      <mesh position={[0.48, 0.28, 0]} material={material}>
        <sphereGeometry args={[0.2, 20, 20]} />
      </mesh>
      <mesh position={[0.74, 0.25, 0]} rotation={[0, 0, -0.35]}>
        <coneGeometry args={[0.045, 0.22, 10]} />
        <meshPhysicalMaterial color={new THREE.Color(0x080818)} roughness={0.25} metalness={0} />
      </mesh>
      <group position={[-0.38, -0.48, 0]} rotation={[0, 0, 0.28]}>
        <mesh>
          <coneGeometry args={[0.12, 0.44, 10]} />
          <primitive object={material} />
        </mesh>
      </group>
      {/* Crimson eye — raven */}
      <mesh position={[0.58, 0.34, 0.14]}>
        <sphereGeometry args={[0.038, 16, 16]} />
        <meshStandardMaterial
          color={new THREE.Color('#FF3347')}
          emissive={new THREE.Color('#D81829')}
          emissiveIntensity={4}
        />
      </mesh>
      {/* Eye glow halo */}
      <mesh position={[0.58, 0.34, 0.13]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial
          color={new THREE.Color('#D81829')}
          emissive={new THREE.Color('#D81829')}
          emissiveIntensity={1.5}
          transparent
          opacity={0.22}
        />
      </mesh>
    </group>
  );
}

/* ── Raven assembly ─────────────────────────────────── */

function Raven() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.25) * 0.12;
  });

  return (
    <group ref={ref} position={[1.5, 0, 0]} scale={0.82}>
      <group position={[0.3, 0.14, 0]} rotation={[0.18, 0, -0.1]}>
        <Wing flip={false} delay={0} />
      </group>
      <group position={[-0.3, 0.14, 0]} rotation={[0.18, 0, 0.1]}>
        <Wing flip={true} delay={0.15} />
      </group>
      <Body />
    </group>
  );
}

/* ── Particle cloud ─────────────────────────────────── */

function ParticleCloud({ count = 130 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    /* crimson + teal + near-white palette */
    const palette: [number, number, number][] = [
      [0.85, 0.094, 0.16],   /* crimson */
      [0.66, 0.094, 0.13],   /* crimson dark */
      [0.0,  0.74,  0.675],  /* teal */
      [0.0,  0.55,  0.5],    /* teal dark */
      [0.85, 0.84,  0.9],    /* near-white */
    ];
    for (let i = 0; i < count; i++) {
      const r = 3.0 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta) + 1.5;
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.013;
    ref.current.rotation.x = clock.getElapsedTime() * 0.006;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.026} transparent opacity={0.5} sizeAttenuation vertexColors />
    </points>
  );
}

/* ── Exported scene ─────────────────────────────────── */

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 8], fov: 50 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      {/* Lighting — crimson atmosphere */}
      <ambientLight color="#080308" intensity={0.7} />
      <pointLight position={[-3, 5, 3]}  color="#D81829" intensity={28} distance={18} decay={2} />
      <pointLight position={[5, -2, 4]}  color="#00BDAC" intensity={18} distance={15} decay={2} />
      <pointLight position={[0, -4, 6]}  color="#A91321" intensity={10} distance={14} decay={2} />
      <pointLight position={[2, 3, 2]}   color="#FFFFFF"  intensity={4}  distance={8}  decay={2} />

      <Environment preset="night" />

      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <Raven />
      </Float>

      <ParticleCloud count={140} />

      {/* Crimson sparkles */}
      <Sparkles
        count={55}
        size={1.1}
        scale={[12, 8, 6]}
        speed={0.32}
        color="#D81829"
        opacity={0.4}
        position={[1.5, 0, 0]}
      />
      {/* Teal sparkles */}
      <Sparkles
        count={22}
        size={0.85}
        scale={[8, 6, 4]}
        speed={0.18}
        color="#00BDAC"
        opacity={0.32}
        position={[1.5, 0, 0]}
      />
    </Canvas>
  );
}
