export function SectionDivider({ color, label, count }: { color: string; label: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
      <span className="text-[12px] font-medium text-text-secondary">
        {label}
        {count != null && (
          <span className="text-text-muted ml-1">({count})</span>
        )}
      </span>
    </div>
  );
}
