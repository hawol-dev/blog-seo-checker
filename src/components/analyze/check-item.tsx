'use client';

import type { CheckResult, CheckStatus } from '@/lib/seo/types';

interface CheckItemProps {
  check: CheckResult;
}

const STATUS_STYLES: Record<CheckStatus, {
  bg: string;
  border: string;
  iconBg: string;
  iconColor: string;
  icon: string;
}> = {
  error: {
    bg: 'bg-red-dim',
    border: 'border-red/20',
    iconBg: 'bg-red/15',
    iconColor: 'text-red',
    icon: '\u2715',
  },
  warn: {
    bg: 'bg-yellow-dim',
    border: 'border-yellow/20',
    iconBg: 'bg-yellow/15',
    iconColor: 'text-yellow',
    icon: '\u25B3',
  },
  pass: {
    bg: 'bg-surface',
    border: 'border-transparent',
    iconBg: 'bg-green/15',
    iconColor: 'text-green',
    icon: '\u2713',
  },
};

export function CheckItem({ check }: CheckItemProps) {
  const style = STATUS_STYLES[check.status];
  const showHint = check.status !== 'pass' && check.hint;

  return (
    <div
      className={`flex items-start gap-3 px-3.5 py-2.5 rounded-lg border ${style.bg} ${style.border}`}
    >
      {/* Icon circle */}
      <div
        className={`w-[22px] h-[22px] shrink-0 rounded-full flex items-center justify-center mt-px ${style.iconBg}`}
      >
        <span className={`text-[10px] font-bold leading-none ${style.iconColor}`}>
          {style.icon}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-bold text-text-primary truncate">
            {check.name}
          </span>
          <span className="text-[12px] font-bold text-text-secondary shrink-0">
            {check.score}/{check.maxScore}
          </span>
        </div>
        {showHint && (
          <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
            {check.hint}
          </p>
        )}
      </div>

      {/* Gain badge */}
      {check.gainIfFixed != null && check.gainIfFixed > 0 && (
        <span className="shrink-0 text-[11px] font-bold text-green bg-green-dim px-1.5 py-0.5 rounded mt-px">
          +{check.gainIfFixed}
        </span>
      )}
    </div>
  );
}
