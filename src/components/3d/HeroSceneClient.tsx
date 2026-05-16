'use client';
import dynamic from 'next/dynamic';

const HeroScene = dynamic(
  () => import('@/components/3d/HeroScene').then((m) => ({ default: m.HeroScene })),
  { ssr: false, loading: () => null },
);

export function HeroSceneClient() {
  return <HeroScene />;
}
