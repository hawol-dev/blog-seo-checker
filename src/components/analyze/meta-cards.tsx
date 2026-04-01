'use client';

import { useAnalyzeStore } from '@/stores/analyze-store';
import type { AnalyzeInput } from '@/lib/seo/types';

interface MetaCardProps {
  label: string;
  field: keyof AnalyzeInput;
  colorClass?: string;
}

const META_FIELDS: MetaCardProps[] = [
  { label: '이미지', field: 'imageCount' },
  { label: '동영상', field: 'videoCount' },
  { label: '태그', field: 'tagCount' },
  { label: '외부링크', field: 'externalLinkCount', colorClass: 'text-red' },
  { label: '내부링크', field: 'internalLinkCount', colorClass: 'text-green' },
];

function MetaCard({ label, field, colorClass }: MetaCardProps) {
  const value = useAnalyzeStore((s) => s[field] as number);
  const setField = useAnalyzeStore((s) => s.setField);

  const hasActiveColor = colorClass && value > 0;

  const decrement = () => {
    if (value > 0) {
      setField(field, (value - 1) as AnalyzeInput[typeof field]);
    }
  };

  const increment = () => {
    setField(field, (value + 1) as AnalyzeInput[typeof field]);
  };

  return (
    <div className="flex flex-col items-center gap-1 bg-elevated rounded-lg px-2 py-2.5">
      <span className="text-text-muted text-[10px] leading-none">{label}</span>
      <span
        className={`font-display font-extrabold text-lg leading-none ${
          hasActiveColor ? colorClass : 'text-text-primary'
        }`}
      >
        {value}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= 0}
          className="w-8 h-8 flex items-center justify-center rounded text-text-muted hover:text-text-secondary hover:bg-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs"
          aria-label={`${label} 감소`}
        >
          -
        </button>
        <button
          type="button"
          onClick={increment}
          className="w-8 h-8 flex items-center justify-center rounded text-text-muted hover:text-text-secondary hover:bg-surface transition-colors text-xs"
          aria-label={`${label} 증가`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export function MetaCards() {
  return (
    <div className="grid grid-cols-5 gap-2">
      {META_FIELDS.map(({ label, field, colorClass }) => (
        <MetaCard key={field} label={label} field={field} colorClass={colorClass} />
      ))}
    </div>
  );
}
