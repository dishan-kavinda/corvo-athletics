'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* ── Wing geometry ──────────────────────────────────── */

function createWingShape(): THREE.Shape {
  const shape = new THREE.Shape();

  // Wing root at origin — wing extends rightward
  shape.moveTo(0, 0);

  // Leading edge: root → carpal → outer primaries
  shape.bezierCurveTo(0.4, 0.3, 0.9, 0.8, 1.4, 1.05);
  shape.bezierCurveTo(1.85, 1.28, 2.32, 1.52, 2.82, 1.64);
  shape.bezierCurveTo(3.0, 1.72, 3.28, 1.62, 3.46, 1.44);

  // Primary feather scalloped trailing tips (outer → inner)
  shape.quadraticCurveTo(3.38, 0.94, 3.12, 0.86);
  shape.quadraticCurveTo(2.98, 0.70, 2.82, 0.62);
  shape.quadraticCurveTo(2.68, 0.50, 2.52, 0.42);
  shape.quadraticCurveTo(2.36, 0.30, 2.18, 0.22);
  shape.quadraticCurveTo(2.02, 0.14, 1.84, 0.08);
  shape.quadraticCurveTo(1.68, 0.04, 1.50, 0.02);

  // Trailing edge back to root
  shape.bezierCurveTo(1.2, -0.06, 0.8, -0.10, 0.45, -0.08);
  shape.quadraticCurveTo(0.18, -0.04, 0, 0);

  return shape;
}

/* ── Wing mesh ──────────────────────────────────────── */

interface WingProps {
  flip?: boolean;
  delay?: number;
}

function Wing({ flip = false, delay = 0 }: WingProps) {
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const shape = createWingShape();
    return new THREE.ShapeGeometry(shape, 96);
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() + delay;
    // Soaring dihedral oscillation
    groupRef.current.rotation.z = (flip ? 1 : -1) * (Math.sin(t * 0.9) * 0.06 + 0.12);
    groupRef.current.rotation.x = Math.sin(t * 0.5 + 1.2) * 0.04;
  });

  return (
    <group ref={groupRef} scale={[flip ? -1 : 1, 1, 1]}>
      {/* Main wing surface */}
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color={new THREE.Color(0x020212)}
          roughness={0.12}
          metalness={0.0}
          sheen={1.8}
          sheenColor={new THREE.Color('#7B5FFF')}
          sheenRoughness={0.08}
          clearcoat={0.5}
          clearcoatRoughness={0.04}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Iridescent edge glow line */}
      <lineSegments>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial color="#7B5FFF" transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}

/* ── Raven body / head ──────────────────────────────── */

function Body() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = Math.sin(t * 0.9) * 0.025;
  });

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x010110),
        roughness: 0.1,
        metalness: 0.0,
        sheen: 1.2,
        sheenColor: new THREE.Color('#7B5FFF'),
        sheenRoughness: 0.1,
        clearcoat: 0.4,
      }),
    [],
  );

  return (
    <group ref={ref}>
      {/* Body */}
      <mesh position={[0, -0.18, 0]} material={material}>
        <sphereGeometry args={[0.32, 20, 20]} />
      </mesh>
      {/* Neck */}
      <mesh position={[0.28, 0.1, 0]} rotation={[0, 0, -0.4]} material={material}>
        <cylinderGeometry args={[0.12, 0.18, 0.32, 16]} />
      </mesh>
      {/* Head */}
      <mesh position={[0.48, 0.28, 0]} material={material}>
        <sphereGeometry args={[0.2, 20, 20]} />
      </mesh>
      {/* Beak */}
      <mesh position={[0.74, 0.25, 0]} rotation={[0, 0, -0.35]}>
        <coneGeometry args={[0.045, 0.22, 10]} />
        <meshPhysicalMaterial color={new THREE.Color(0x0a0a22)} roughness={0.3} metalness={0} />
      </mesh>
      {/* Tail */}
      <group position={[-0.38, -0.48, 0]} rotation={[0, 0, 0.28]}>
        <mesh>
          <coneGeometry args={[0.12, 0.44, 10]} />
          <primitive object={material} />
        </mesh>
      </group>
      {/* Glowing eye — violet */}
      <mesh position={[0.58, 0.34, 0.14]}>
        <sphereGeometry args={[0.038, 16, 16]} />
        <meshStandardMaterial
          color={new THREE.Color('#9B70FF')}
          emissive={new THREE.Color('#7B5FFF')}
          emissiveIntensity={3}
        />
      </mesh>
      {/* Eye glow halo */}
      <mesh position={[0.58, 0.34, 0.13]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial
          color={new THREE.Color('#7B5FFF')}
          emissive={new THREE.Color('#7B5FFF')}
          emissiveIntensity={1}
          transparent
          opacity={0.18}
        />
      </mesh>
    </group>
  );
}

/* ── Full raven assembly ────────────────────────────── */

function Raven() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = Math.sin(t * 0.25) * 0.12;
  });

  return (
    <group ref={ref} position={[1.5, 0, 0]} scale={0.82}>
      {/* Right wing — angles slightly up */}
      <group position={[0.3, 0.14, 0]} rotation={[0.18, 0, -0.1]}>
        <Wing flip={false} delay={0} />
      </group>
      {/* Left wing — mirrored */}
      <group position={[-0.3, 0.14, 0]} rotation={[0.18, 0, 0.1]}>
        <Wing flip={true} delay={0.15} />
      </group>
      <Body />
    </group>
  );
}

/* ── Ambient particle field ─────────────────────────── */

function ParticleCloud({ count = 120 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette: [number, number, number][] = [
      [0.48, 0.37, 1.0],
      [0.35, 0.22, 0.78],
      [0.18, 0.36, 1.0],
      [0.79, 0.66, 0.38],
      [0.88, 0.84, 1.0],
    ];
    for (let i = 0; i < count; i++) {
      const r = 3.0 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta) + 1.5;
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.012;
    ref.current.rotation.x = clock.getElapsedTime() * 0.006;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.028} transparent opacity={0.55} sizeAttenuation vertexColors />
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
        toneMappingExposure: 1.3,
      }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      {/* Lighting — iridescent atmosphere */}
      <ambientLight color="#0A0820" intensity={0.6} />
      <pointLight position={[-3, 5, 3]} color="#7B5FFF" intensity={22} distance={18} decay={2} />
      <pointLight position={[5, -2, 4]} color="#4A9EFF" intensity={16} distance={15} decay={2} />
      <pointLight position={[0, -4, 6]} color="#C9A961" intensity={12} distance={14} decay={2} />
      <pointLight position={[2, 3, 2]} color="#FFFFFF" intensity={5} distance={8} decay={2} />

      {/* Night sky env map for metallic reflections */}
      <Environment preset="night" />

      {/* Raven — Float adds soaring drift */}
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <Raven />
      </Float>

      {/* Ambient particles */}
      <ParticleCloud count={140} />

      {/* Sparkle atmosphere */}
      <Sparkles
        count={60}
        size={1.2}
        scale={[12, 8, 6]}
        speed={0.35}
        color="#7B5FFF"
        opacity={0.45}
        position={[1.5, 0, 0]}
      />
      <Sparkles
        count={25}
        size={0.9}
        scale={[8, 6, 4]}
        speed={0.2}
        color="#C9A961"
        opacity={0.35}
        position={[1.5, 0, 0]}
      />
    </Canvas>
  );
}
