import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { HistoryContent } from '@/components/history/history-content';

export const metadata: Metadata = {
  title: '분석 히스토리 — PostKit',
  description: 'SEO 분석 히스토리를 확인하고 점수 추이를 비교하세요.',
};

export default function HistoryPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 min-h-0 p-3 gap-3">
        <HistoryContent />
      </main>
    </>
  );
}
