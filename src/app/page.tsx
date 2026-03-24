import { Header } from '@/components/layout/header';
import { InputPanel } from '@/components/analyze/input-panel';

export default function AnalyzePage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 min-h-0 p-3 gap-3">
        <div className="w-[44%] shrink-0">
          <InputPanel />
        </div>
        <div className="flex-1 bg-base rounded-xl p-5 min-h-0 flex items-center justify-center">
          <p className="text-text-muted text-sm">글을 입력하고 분석해보세요</p>
        </div>
      </main>
    </>
  );
}
