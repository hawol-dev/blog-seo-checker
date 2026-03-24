import { Header } from '@/components/layout/header';
import { HistoryContent } from '@/components/history/history-content';

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
