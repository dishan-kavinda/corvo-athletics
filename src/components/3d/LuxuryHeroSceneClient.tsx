'use client';
import dynamic from 'next/dynamic';

const LuxuryHeroScene = dynamic(
  () => import('@/components/3d/HeroScene').then((m) => ({ default: m.LuxuryHeroScene })),
  { ssr: false, loading: () => null },
);

export function LuxuryHeroSceneClient() {
  return <LuxuryHeroScene />;
}
