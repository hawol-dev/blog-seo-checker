'use client';

import { useState } from 'react';
import type { HistoryItem } from '@/actions/history';
import type { Grade } from '@/lib/seo/types';

interface HistoryListProps {
  items: HistoryItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

type FilterTab = 'all' | 'high' | 'low';

const GRADE_COLORS: Record<string, string> = {
  S: '#9b7cfa',
  A: '#34d399',
  B: '#60a5fa',
  C: '#fbbf24',
  D: '#f87171',
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

function GradeBadge({ grade }: { grade: string }) {
  const color = GRADE_COLORS[grade] ?? '#555566';
  return (
    <span
      className="shrink-0 text-[11px] font-bold px-1.5 py-0.5 rounded"
      style={{ color, background: `${color}22` }}
    >
      {grade}
    </span>
  );
}

function ScoreCircle({ score, grade }: { score: number; grade: string }) {
  const color = GRADE_COLORS[grade] ?? '#555566';
  return (
    <div
      className="w-[42px] h-[42px] shrink-0 rounded-full flex items-center justify-center border-2"
      style={{ borderColor: color }}
    >
      <span className="text-[13px] font-bold text-text-primary">{score}</span>
    </div>
  );
}

export function HistoryList({ items, selectedId, onSelect }: HistoryListProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterTab>('all');

  const filtered = items.filter((item) => {
    // Search filter
    if (search) {
      const query = search.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(query);
      const matchesKeyword = item.keyword.toLowerCase().includes(query);
      if (!matchesTitle && !matchesKeyword) return false;
    }

    // Grade filter
    if (filter === 'high') {
      return item.grade === 'S' || item.grade === 'A';
    }
    if (filter === 'low') {
      return item.grade === 'B' || item.grade === 'C' || item.grade === 'D';
    }

    return true;
  });

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'high', label: 'S\u00B7A' },
    { key: 'low', label: 'B\u2193' },
  ];

  return (
    <div className="w-full bg-base rounded-xl flex flex-col min-h-0">
      {/* Header */}
      <div className="p-4 pb-3 shrink-0">
        <div className="flex items-baseline gap-2 mb-3">
          <h2 className="text-[16px] font-bold text-text-primary">분석 히스토리</h2>
          <span className="text-[12px] text-text-muted">
            총 {items.length}개 분석
          </span>
        </div>

        {/* Search box */}
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[13px]">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="키워드로 검색..."
            className="w-full bg-surface border border-border rounded-lg pl-9 pr-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1">
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded-md text-[12px] font-medium transition-colors ${
                filter === key
                  ? 'bg-accent/15 text-accent'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 flex flex-col gap-1.5">
        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-[13px] text-text-muted">
              {search || filter !== 'all'
                ? '조건에 맞는 분석이 없어요'
                : '아직 분석 기록이 없어요'}
            </p>
          </div>
        )}

        {filtered.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                isSelected
                  ? 'bg-accent/10 border border-accent/30'
                  : 'bg-surface border border-transparent hover:bg-elevated'
              }`}
            >
              <ScoreCircle score={item.totalScore} grade={item.grade} />

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-text-primary truncate">
                  {item.title}
                </p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  {formatDate(item.createdAt)}
                  <span className="text-accent ml-2">키워드: {item.keyword}</span>
                </p>
              </div>

              <GradeBadge grade={item.grade} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
