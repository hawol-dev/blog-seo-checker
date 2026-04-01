'use client';

import Link from 'next/link';
import { ScoreRing } from '@/components/analyze/score-ring';
import { CheckItem } from '@/components/analyze/check-item';
import { SectionDivider } from '@/components/ui/section-divider';
import { groupChecks } from '@/lib/seo/group-checks';
import type { Grade, CheckResult } from '@/lib/seo/types';
import { STATUS_COLORS } from '@/lib/constants/colors';

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
  onBack?: () => void;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function HistoryDetail({ analysis, onBack }: HistoryDetailProps) {
  if (!analysis) {
    return (
      <div className="w-full bg-base rounded-xl flex items-center justify-center">
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
    <div className="w-full bg-base rounded-xl p-5 min-h-0 flex flex-col overflow-hidden">
      {/* Mobile back button */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="md:hidden flex items-center gap-1 text-sm text-text-secondary mb-3 hover:text-text-primary transition-colors"
        >
          ← 목록으로
        </button>
      )}
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
            <SectionDivider color={STATUS_COLORS.error} label="수정 필요" />
            {errors.map((check) => (
              <CheckItem key={check.name} check={check} />
            ))}
          </>
        )}

        {warns.length > 0 && (
          <>
            <SectionDivider color={STATUS_COLORS.warn} label="개선 추천" />
            {warns.map((check) => (
              <CheckItem key={check.name} check={check} />
            ))}
          </>
        )}

        {passes.length > 0 && (
          <>
            <SectionDivider color={STATUS_COLORS.pass} label="통과" count={passedCount} />
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
