'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

function useIsLowEnd(): boolean {
  const [lowEnd, setLowEnd] = useState(false);
  useEffect(() => {
    const narrow = window.innerWidth < 768;
    const fewCores = navigator.hardwareConcurrency != null && navigator.hardwareConcurrency <= 2;
    setLowEnd(narrow || fewCores);
  }, []);
  return lowEnd;
}

/* ─── Helpers ───────────────────────────────────────────────
   Extract the 20 unique vertex positions from DodecahedronGeometry.
   EdgesGeometry gives the 30 clean edges (no triangle diagonals).
──────────────────────────────────────────────────────────── */
function dodecVerts(radius: number): THREE.Vector3[] {
  const geo = new THREE.DodecahedronGeometry(radius, 0);
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  const seen = new Map<string, THREE.Vector3>();
  for (let i = 0; i < pos.count; i++) {
    const key = `${pos.getX(i).toFixed(3)},${pos.getY(i).toFixed(3)},${pos.getZ(i).toFixed(3)}`;
    if (!seen.has(key))
      seen.set(key, new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
  }
  geo.dispose();
  return Array.from(seen.values());
}

function dodecEdges(radius: number): THREE.BufferGeometry {
  const geo   = new THREE.DodecahedronGeometry(radius, 0);
  const edges = new THREE.EdgesGeometry(geo);
  geo.dispose();
  return edges;
}

/* 20 radial spoke lines: each outer vertex → same direction scaled to innerR */
function dodecSpokes(outerR: number, innerR: number): THREE.BufferGeometry {
  const verts = dodecVerts(outerR);
  const pts: number[] = [];
  for (const v of verts) {
    const inner = v.clone().normalize().multiplyScalar(innerR);
    pts.push(v.x, v.y, v.z, inner.x, inner.y, inner.z);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  return geo;
}

/* ─── Logo Texture + Mesh ───────────────────────────────────
   Rasterises the SVG to a canvas, tints it, feeds a CanvasTexture
   to a translucent plane. Lerps at 0.026 (cage lerps at 0.055)
   so the logo moves slower — creating perceived z-depth.
──────────────────────────────────────────────────────────── */
function useLogoTexture(tint: string): THREE.CanvasTexture | null {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = 1200; c.height = 600;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0, 1200, 600);
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, 1200, 600);
      setTex(new THREE.CanvasTexture(c));
    };
    img.src = '/logo-savage-clean.svg';
  }, [tint]);
  return tex;
}

function LogoMesh({ tint, baseOpacity }: { tint: string; baseOpacity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse   = useRef({ x: 0, y: 0 });
  const tex     = useLogoTexture(tint);

  const mat = useMemo(
    () =>
      tex
        ? new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            opacity: baseOpacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        : null,
    [tex, baseOpacity],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current || !mat) return;
    const t = clock.getElapsedTime();
    const { x, y } = mouse.current;
    meshRef.current.rotation.y += (x * Math.PI * 0.22 - meshRef.current.rotation.y) * 0.026;
    meshRef.current.rotation.x += (y * Math.PI * 0.11 - meshRef.current.rotation.x) * 0.026;
    mat.opacity = baseOpacity * (0.82 + Math.sin(t * 0.85) * 0.18);
  });

  if (!mat) return null;

  return (
    <mesh ref={meshRef} material={mat} position={[0, 0, -0.6]}>
      <planeGeometry args={[3.6, 1.8]} />
    </mesh>
  );
}

/* ─── Dodec Cage ────────────────────────────────────────────
   Outer dodecahedron (crimson) + inner dodecahedron (teal).
   20 radial spokes connect every outer vertex to its inner twin.
   Both shells + spokes rotate as one rigid unit — vertices always aligned.
──────────────────────────────────────────────────────────── */
const OUTER_R = 2.4;
const INNER_R = 1.25;

function DodecCage() {
  const cageRef = useRef<THREE.Group>(null);
  const mouse   = useRef({ x: 0, y: 0 });

  const outerGeo = useMemo(() => dodecEdges(OUTER_R), []);
  const innerGeo = useMemo(() => dodecEdges(INNER_R), []);
  const spokeGeo = useMemo(() => dodecSpokes(OUTER_R, INNER_R), []);

  const outerMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#FF2A3C', transparent: true, opacity: 0.88 }),
    [],
  );
  const innerMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#00EFDC', transparent: true, opacity: 0.78 }),
    [],
  );
  const spokeMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#CC1828', transparent: true, opacity: 0.38 }),
    [],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ clock }) => {
    if (!cageRef.current) return;
    const t = clock.getElapsedTime();
    const { x, y } = mouse.current;

    const tY = x * Math.PI * 0.75;
    const tX = y * Math.PI * 0.40;
    cageRef.current.rotation.y += (tY - cageRef.current.rotation.y) * 0.055;
    cageRef.current.rotation.x += (tX - cageRef.current.rotation.x) * 0.055;
    cageRef.current.rotation.z  = t * 0.055;
  });

  return (
    <>
      <LogoMesh tint="#FF1428" baseOpacity={0.92} />
      <group ref={cageRef}>
        <lineSegments geometry={outerGeo} material={outerMat} />
        <lineSegments geometry={spokeGeo} material={spokeMat} />
        <lineSegments geometry={innerGeo} material={innerMat} />
      </group>
    </>
  );
}

/* ─── Scene ─────────────────────────────────────────────── */
export function HeroScene() {
  const lowEnd = useIsLowEnd();
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 48 }}
      gl={{ antialias: !lowEnd, alpha: true, powerPreference: 'high-performance' }}
      dpr={lowEnd ? 1 : [1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <DodecCage />

      {!lowEnd && (
        <>
          <Sparkles count={35} size={0.7} scale={[9, 7, 5]} speed={0.16} color="#CC0000" opacity={0.28} />
          <Sparkles count={14} size={0.5} scale={[6, 4, 4]} speed={0.10} color="#00BDAC" opacity={0.18} />
        </>
      )}

      {!lowEnd && (
        <EffectComposer>
          <Bloom
            intensity={2.8}
            luminanceThreshold={0.10}
            luminanceSmoothing={0.88}
            mipmapBlur
            radius={0.85}
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}

/* ─── Luxury Form ────────────────────────────────────────
   Two nested icosahedron wireframes — matte old-gold outer,
   warm bone inner. No bloom, no glow, no particles.
   Slow meditative rotation. Completely different character.
──────────────────────────────────────────────────────────── */
function LuxuryForm() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse    = useRef({ x: 0, y: 0 });

  const outerGeo = useMemo(() => {
    const base  = new THREE.IcosahedronGeometry(2.2, 1);
    const edges = new THREE.EdgesGeometry(base);
    base.dispose();
    return edges;
  }, []);

  const innerGeo = useMemo(() => {
    const base  = new THREE.IcosahedronGeometry(1.1, 0);
    const edges = new THREE.EdgesGeometry(base);
    base.dispose();
    return edges;
  }, []);

  const outerMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#B8962C', transparent: true, opacity: 0.42 }),
    [],
  );
  const innerMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#D4C9B0', transparent: true, opacity: 0.25 }),
    [],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const { x, y } = mouse.current;
    groupRef.current.rotation.y += (x * Math.PI * 0.28 - groupRef.current.rotation.y) * 0.022;
    groupRef.current.rotation.x += (y * Math.PI * 0.14 - groupRef.current.rotation.x) * 0.022;
    groupRef.current.rotation.z  = t * 0.018;
  });

  return (
    <>
      <LogoMesh tint="#C9A961" baseOpacity={0.50} />
      <group ref={groupRef}>
        <lineSegments geometry={outerGeo} material={outerMat} />
        <lineSegments geometry={innerGeo} material={innerMat} />
      </group>
    </>
  );
}

/* No bloom, no sparkles, no point lights — matte and clean */
export function LuxuryHeroScene() {
  const lowEnd = useIsLowEnd();
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 42 }}
      gl={{ antialias: !lowEnd, alpha: true, powerPreference: 'high-performance' }}
      dpr={lowEnd ? 1 : [1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 3]} intensity={0.25} />
      <LuxuryForm />
    </Canvas>
  );
}
