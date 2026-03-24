'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAnalyzeStore } from '@/stores/analyze-store';
import { ScoreRing } from '@/components/analyze/score-ring';
import { CheckItem } from '@/components/analyze/check-item';
import type { CheckResult } from '@/lib/seo/types';

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

const AUTO_DISMISS_MS = 5000;

function ErrorBanner({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex items-center justify-between gap-3 mb-3 shrink-0">
      <span className="text-[13px] text-red-400 leading-snug">{message}</span>
      <button
        onClick={onClose}
        className="text-red-400 hover:text-red-300 text-[18px] leading-none shrink-0 transition-colors"
        aria-label="에러 닫기"
      >
        &times;
      </button>
    </div>
  );
}

export function ResultPanel() {
  const result = useAnalyzeStore((s) => s.result);
  const isLoading = useAnalyzeStore((s) => s.isLoading);
  const error = useAnalyzeStore((s) => s.error);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) setShowError(true);
  }, [error]);

  const handleCloseError = useCallback(() => setShowError(false), []);

  if (!result && !isLoading) {
    return (
      <div className="flex-1 bg-base rounded-xl p-5 min-h-0 flex flex-col overflow-hidden">
        {showError && error && (
          <ErrorBanner message={error} onClose={handleCloseError} />
        )}
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <span className="text-[40px] leading-none opacity-60" aria-hidden="true">
            📝
          </span>
          <p className="text-[14px] text-text-muted">글을 입력하고 분석해보세요</p>
          <p className="text-[12px] text-text-muted/70">
            제목, 키워드, 본문을 입력한 후 분석 버튼을 눌러주세요
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 bg-base rounded-xl p-5 min-h-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block w-8 h-8 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-[13px] text-text-muted">SEO 분석 중이에요...</p>
        </div>
      </div>
    );
  }

  const { errors, warns, passes } = groupChecks(result!.checks);
  const passedCount = passes.length;
  const totalCount = result!.checks.length;
  const maxGain = result!.checks.reduce(
    (sum, c) => sum + (c.gainIfFixed ?? 0),
    0,
  );

  return (
    <div className="flex-1 bg-base rounded-xl p-5 min-h-0 flex flex-col overflow-hidden">
      {/* Error banner */}
      {showError && error && (
        <ErrorBanner message={error} onClose={handleCloseError} />
      )}

      {/* Score header */}
      <div className="flex items-center gap-4 bg-surface rounded-2xl p-4">
        <ScoreRing score={result!.totalScore} grade={result!.grade} />
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[16px] font-bold text-text-primary leading-snug">
            {result!.gradeMessage}
          </span>
          <span className="text-[12px] text-text-muted leading-snug">
            {totalCount}개 항목 중 {passedCount}개 통과
            {maxGain > 0 && <> · 개선 시 최대 +{maxGain}점</>}
          </span>
        </div>
      </div>

      {/* Checklist */}
      <div className="flex-1 min-h-0 overflow-y-auto mt-4 flex flex-col gap-2">
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
    </div>
  );
}
