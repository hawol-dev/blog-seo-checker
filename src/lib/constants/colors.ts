import type { CheckStatus, Grade } from '@/lib/seo/types';

export const STATUS_COLORS: Record<CheckStatus, string> = {
  error: '#f87171',
  warn: '#fbbf24',
  pass: '#34d399',
};

export const GRADE_COLORS: Record<Grade, string> = {
  S: '#9b7cfa',
  A: '#34d399',
  B: '#60a5fa',
  C: '#fbbf24',
  D: '#f87171',
};
