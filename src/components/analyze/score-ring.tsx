'use client';

import type { Grade } from '@/lib/seo/types';

interface ScoreRingProps {
  score: number;
  grade: Grade;
}

const GRADE_COLORS: Record<Grade, string> = {
  S: '#34d399',
  A: '#34d399',
  B: '#60a5fa',
  C: '#fbbf24',
  D: '#f87171',
};

const GRADE_GLOWS: Record<Grade, string> = {
  S: 'rgba(52, 211, 153, 0.25)',
  A: 'rgba(52, 211, 153, 0.25)',
  B: 'rgba(96, 165, 250, 0.25)',
  C: 'rgba(251, 191, 36, 0.25)',
  D: 'rgba(248, 113, 113, 0.25)',
};

export function ScoreRing({ score, grade }: ScoreRingProps) {
  const color = GRADE_COLORS[grade];
  const glow = GRADE_GLOWS[grade];
  const progress = score / 100;

  return (
    <div
      className="relative shrink-0"
      style={{ width: 64, height: 64 }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-md"
        style={{ background: glow }}
      />

      {/* Ring with conic-gradient */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${color} 0deg, ${color} ${progress * 360}deg, #1a1a24 ${progress * 360}deg)`,
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))',
          WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))',
        }}
      />

      {/* Inner content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display text-2xl font-extrabold leading-none"
          style={{ color }}
        >
          {score}
        </span>
        <span
          className="text-[8px] font-bold leading-none mt-0.5"
          style={{ color }}
        >
          {grade}
        </span>
      </div>
    </div>
  );
}
