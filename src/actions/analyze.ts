'use server';

import { analyze } from '@/lib/seo/analyzer';
import type { AnalyzeInput, AnalyzeResult } from '@/lib/seo/types';

export async function analyzePost(input: AnalyzeInput): Promise<AnalyzeResult> {
  if (!input.title?.trim()) {
    throw new Error('제목을 입력해주세요.');
  }
  if (!input.keyword?.trim()) {
    throw new Error('타겟 키워드를 입력해주세요.');
  }
  if (!input.content?.trim()) {
    throw new Error('본문 내용을 입력해주세요.');
  }

  return analyze(input);
}
