'use client';

import { useAnalyzeStore } from '@/stores/analyze-store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MetaCards } from '@/components/analyze/meta-cards';

export function InputPanel() {
  const title = useAnalyzeStore((s) => s.title);
  const keyword = useAnalyzeStore((s) => s.keyword);
  const content = useAnalyzeStore((s) => s.content);
  const isLoading = useAnalyzeStore((s) => s.isLoading);
  const error = useAnalyzeStore((s) => s.error);
  const setField = useAnalyzeStore((s) => s.setField);
  const analyze = useAnalyzeStore((s) => s.analyze);

  const isDisabled = !title.trim() || !keyword.trim() || !content.trim();

  return (
    <div className="flex flex-col gap-3 bg-surface rounded-xl p-5 h-full overflow-hidden">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-xs text-text-secondary font-medium">
          제목
        </label>
        <Input
          id="title"
          placeholder="블로그 글 제목을 입력하세요"
          value={title}
          onChange={(e) => setField('title', e.target.value)}
          className="bg-elevated border-border text-text-primary placeholder:text-text-muted"
        />
      </div>

      {/* Keyword */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="keyword" className="text-xs text-text-secondary font-medium">
          타겟 키워드
        </label>
        <Input
          id="keyword"
          placeholder="상위노출을 원하는 키워드"
          value={keyword}
          onChange={(e) => setField('keyword', e.target.value)}
          className="bg-elevated border-border text-text-primary placeholder:text-text-muted focus-visible:border-accent focus-visible:ring-accent-glow"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 flex-1 min-h-0">
        <div className="flex items-center justify-between">
          <label htmlFor="content" className="text-xs text-text-secondary font-medium">
            본문 내용
          </label>
          <span className="text-[10px] text-text-muted">
            {content.length.toLocaleString()}자
          </span>
        </div>
        <Textarea
          id="content"
          placeholder="블로그 본문을 붙여넣기 하세요"
          value={content}
          onChange={(e) => setField('content', e.target.value)}
          className="flex-1 min-h-0 resize-none overflow-y-auto bg-elevated border-border text-text-primary placeholder:text-text-muted !field-sizing-fixed"
        />
      </div>

      {/* Meta Cards */}
      <MetaCards />

      {/* Error */}
      {error && (
        <p className="text-red text-xs">{error}</p>
      )}

      {/* CTA Button */}
      <Button
        onClick={analyze}
        disabled={isDisabled || isLoading}
        className="w-full h-11 text-sm font-bold bg-gradient-to-br from-accent-dim to-accent text-white border-none hover:shadow-[0_0_20px_rgba(155,124,250,0.3)] hover:-translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            분석 중...
          </span>
        ) : (
          '네이버 SEO 분석하기'
        )}
      </Button>
    </div>
  );
}
