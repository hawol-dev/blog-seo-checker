import { Header } from '@/components/layout/header';
import { InputPanel } from '@/components/analyze/input-panel';
import { ResultPanel } from '@/components/analyze/result-panel';

export default function AnalyzePage() {
  return (
    <>
      <Header />
      <main className="flex flex-col md:flex-row flex-1 min-h-0 p-3 gap-3">
        <div className="w-full md:w-[44%] md:shrink-0">
          <InputPanel />
        </div>
        <ResultPanel />
      </main>
    </>
  );
}
