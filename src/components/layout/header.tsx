'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: '새 분석', href: '/' },
  { label: '히스토리', href: '/history' },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="relative flex items-center h-14 flex-shrink-0 px-5 border-b border-border-subtle">
      {/* Left: Logo + Badge */}
      <div className="flex items-center gap-2.5">
        <Link href="/" className="font-display font-extrabold text-lg tracking-tight">
          Post<span className="text-accent">Kit</span>
        </Link>
        <span className="text-[10px] text-text-muted bg-elevated px-1.5 py-0.5 rounded-sm">
          네이버 블로그 전용
        </span>
      </div>

      {/* Center: Tab Navigation */}
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
        {NAV_ITEMS.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors
                ${isActive
                  ? 'text-text-primary bg-elevated'
                  : 'text-text-muted hover:text-text-secondary'
                }
              `}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Right: Usage Badge + Avatar */}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-xs text-accent bg-accent-glow px-2 py-0.5 rounded-sm font-medium">
          2/3 무료
        </span>
        <div className="w-7 h-7 rounded-full bg-elevated border border-border flex items-center justify-center">
          <span className="text-xs text-text-muted">U</span>
        </div>
      </div>

      {/* Bottom: Accent glow line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-accent/20"
        aria-hidden="true"
      />
    </header>
  );
}
