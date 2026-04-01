'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getHistory, getAnalysis } from '@/actions/history';
import type { HistoryItem } from '@/actions/history';
import { HistoryList } from '@/components/history/history-list';
import { HistoryDetail } from '@/components/history/history-detail';
import type { FullAnalysis } from '@/components/history/history-detail';

export function HistoryContent() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setIsLoadingList(true);
        const data = await getHistory();
        setItems(data);
      } catch {
        setError('히스토리를 불러오는 데 실패했어요.');
      } finally {
        setIsLoadingList(false);
      }
    }
    fetchHistory();
  }, []);

  const handleSelect = useCallback(async (id: string) => {
    if (id === selectedId) return;

    // Empty string means deselect (mobile back navigation)
    if (!id) {
      setSelectedId(null);
      setAnalysis(null);
      return;
    }

    setSelectedId(id);
    setIsLoadingDetail(true);
    setAnalysis(null);

    try {
      const data = await getAnalysis(id);
      setAnalysis(data as FullAnalysis);
    } catch {
      setError('분석 결과를 불러오는 데 실패했어요.');
    } finally {
      setIsLoadingDetail(false);
    }
  }, [selectedId]);

  if (isLoadingList) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-text-muted text-sm">히스토리를 불러오는 중...</p>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted text-sm mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-accent text-sm hover:underline"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-[40px] leading-none opacity-60" aria-hidden="true">
            📋
          </span>
          <p className="text-[14px] text-text-muted">
            아직 분석 히스토리가 없어요
          </p>
          <p className="text-[12px] text-text-muted/70">
            새 분석을 실행하면 여기에 기록돼요
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-accent/15 text-accent text-[13px] font-medium hover:bg-accent/25 transition-colors"
          >
            첫 분석 시작하기 →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${selectedId ? 'hidden md:flex' : 'flex'} w-full md:w-1/2`}>
        <HistoryList
          items={items}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </div>
      <div className={`${selectedId ? 'flex' : 'hidden md:flex'} w-full md:w-1/2`}>
        {isLoadingDetail ? (
          <div className="w-full bg-base rounded-xl flex items-center justify-center">
            <p className="text-text-muted text-sm">분석 결과를 불러오는 중...</p>
          </div>
        ) : (
          <HistoryDetail analysis={analysis} onBack={() => handleSelect('')} />
        )}
      </div>
    </>
  );
}
