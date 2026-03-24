import { Header } from '@/components/layout/header';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto">
        <div className="text-center space-y-4">
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Post<span className="text-accent">Kit</span>
          </h1>
          <p className="text-text-secondary text-sm">
            네이버 블로그 SEO 분석기
          </p>
        </div>
      </main>
    </>
  );
}
