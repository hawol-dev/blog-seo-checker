'use client';

import Link from 'next/link';
import { ScoreRing } from '@/components/analyze/score-ring';
import { CheckItem } from '@/components/analyze/check-item';
import type { Grade, CheckResult } from '@/lib/seo/types';

export interface FullAnalysis {
  id: string;
  title: string;
  keyword: string;
  contentLength: number;
  totalScore: number;
  grade: string;
  result: {
    totalScore: number;
    grade: Grade;
    gradeMessage: string;
    checks: CheckResult[];
  };
  createdAt: string;
}

interface HistoryDetailProps {
  analysis: FullAnalysis | null;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function groupChecks(checks: CheckResult[]) {
  const errors: CheckResult[] = [];
  const warns: CheckResult[] = [];
  const passes: CheckResult[] = [];

  for (const check of checks) {
    if (check.status === 'error') errors.push(check);
    else if (check.status === 'warn') warns.push(check);
    else passes.push(check);
  }

  return { errors, warns, passes };
}

function SectionDivider({ color, label, count }: { color: string; label: string; count?: number }) {
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

export function HistoryDetail({ analysis }: HistoryDetailProps) {
  if (!analysis) {
    return (
      <div className="w-1/2 bg-base rounded-xl flex items-center justify-center">
        <p className="text-text-muted text-sm">분석 항목을 선택해주세요</p>
      </div>
    );
  }

  const { result } = analysis;
  const { errors, warns, passes } = groupChecks(result.checks);
  const passedCount = passes.length;
  const totalCount = result.checks.length;
  const maxGain = result.checks.reduce(
    (sum, c) => sum + (c.gainIfFixed ?? 0),
    0,
  );

  return (
    <div className="w-1/2 bg-base rounded-xl p-5 min-h-0 flex flex-col overflow-hidden">
      {/* Title + meta */}
      <div className="bg-surface rounded-lg p-4 mb-4 shrink-0">
        <h3 className="text-[15px] font-bold text-text-primary mb-1.5 truncate">
          {analysis.title}
        </h3>
        <div className="flex items-center gap-3 text-[12px] text-text-muted">
          <span>{formatDate(analysis.createdAt)}</span>
          <span className="text-accent">키워드: {analysis.keyword}</span>
          <span>{analysis.contentLength.toLocaleString()}자</span>
        </div>
      </div>

      {/* Score ring + message */}
      <div className="flex items-center gap-4 bg-surface rounded-2xl p-4 mb-4 shrink-0">
        <ScoreRing score={result.totalScore} grade={result.grade} />
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[16px] font-bold text-text-primary leading-snug">
            {result.gradeMessage}
          </span>
          <span className="text-[12px] text-text-muted leading-snug">
            {totalCount}개 항목 중 {passedCount}개 통과
            {maxGain > 0 && <> · 개선 시 최대 +{maxGain}점</>}
          </span>
        </div>
      </div>

      {/* Checklist */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2">
        {errors.length > 0 && (
          <>
            <SectionDivider color="#f87171" label="수정 필요" />
            {errors.map((check) => (
              <CheckItem key={check.name} check={check} />
            ))}
          </>
        )}

        {warns.length > 0 && (
          <>
            <SectionDivider color="#fbbf24" label="개선 추천" />
            {warns.map((check) => (
              <CheckItem key={check.name} check={check} />
            ))}
          </>
        )}

        {passes.length > 0 && (
          <>
            <SectionDivider color="#34d399" label="통과" count={passedCount} />
            {passes.map((check) => (
              <CheckItem key={check.name} check={check} />
            ))}
          </>
        )}
      </div>

      {/* Re-analyze button */}
      <div className="mt-4 shrink-0">
        <Link
          href="/"
          className="flex items-center justify-center w-full py-2.5 rounded-lg border border-accent/30 text-accent text-[13px] font-medium hover:bg-accent/10 transition-colors"
        >
          이 글 다시 분석하기 →
        </Link>
      </div>
    </div>
  );
}
