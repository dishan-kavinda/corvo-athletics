'use client';

import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

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

/* ─── Power Core ────────────────────────────────────────────
   Single sphere — GLSL fresnel gradient, hot centre → dark rim.
──────────────────────────────────────────────────────────── */
function PowerCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          varying vec3 vViewPos;
          void main() {
            vNormal  = normalize(normalMatrix * normal);
            vec4 mv  = modelViewMatrix * vec4(position, 1.0);
            vViewPos = -mv.xyz;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vViewPos;
          void main() {
            float NdotV = clamp(dot(normalize(vNormal), normalize(vViewPos)), 0.0, 1.0);
            float pulse = 1.0 + sin(uTime * 1.3) * 0.055;
            float core  = pow(NdotV, 1.5) * pulse;
            vec3 edgeCol = vec3(0.18, 0.0,  0.01);
            vec3 midCol  = vec3(0.86, 0.04, 0.08);
            vec3 hotCol  = vec3(1.00, 0.82, 0.58);
            vec3 col = mix(edgeCol, midCol, smoothstep(0.0,  0.42, NdotV));
                 col = mix(col,     hotCol, smoothstep(0.60, 1.0,  NdotV));
            col *= (0.28 + core * 2.6);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (meshRef.current)
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value =
        clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} material={mat}>
      <sphereGeometry args={[0.22, 64, 64]} />
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
      <group ref={cageRef}>
        <lineSegments geometry={outerGeo} material={outerMat} />
        <lineSegments geometry={spokeGeo} material={spokeMat} />
        <lineSegments geometry={innerGeo} material={innerMat} />
        <PowerCore />
      </group>

      <Sparkles count={35} size={0.7} scale={[9, 7, 5]} speed={0.16} color="#CC0000" opacity={0.28} />
      <Sparkles count={14} size={0.5} scale={[6, 4, 4]} speed={0.10} color="#00BDAC" opacity={0.18} />

      <pointLight position={[0, 0, 0]} color="#CC0000" intensity={14} distance={7}  />
      <pointLight position={[0, 0, 0]} color="#880000" intensity={6}  distance={14} />
    </>
  );
}

/* ─── Scene ─────────────────────────────────────────────── */
export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 48 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <DodecCage />

      <EffectComposer>
        <Bloom
          intensity={1.3}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.90}
          mipmapBlur
          radius={0.72}
        />
      </EffectComposer>
    </Canvas>
  );
}
