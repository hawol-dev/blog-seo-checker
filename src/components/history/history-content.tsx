'use client';

import { useState, useEffect, useCallback } from 'react';
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

  return (
    <>
      <HistoryList
        items={items}
        selectedId={selectedId}
        onSelect={handleSelect}
      />
      {isLoadingDetail ? (
        <div className="w-1/2 bg-base rounded-xl flex items-center justify-center">
          <p className="text-text-muted text-sm">분석 결과를 불러오는 중...</p>
        </div>
      ) : (
        <HistoryDetail analysis={analysis} />
      )}
    </>
  );
}
