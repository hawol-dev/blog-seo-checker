'use server';

import { analyze } from '@/lib/seo/analyzer';
import { createClient } from '@/lib/supabase/server';
import type { AnalyzeInput, AnalyzeResult } from '@/lib/seo/types';
import { checkUsageLimit } from './usage';

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

  await checkUsageLimit();

  const result = analyze(input);

  // Save to DB if user is logged in (non-blocking, don't fail if save fails)
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('analyses').insert({
        user_id: user.id,
        title: input.title,
        keyword: input.keyword,
        content_length: input.content.length,
        total_score: result.totalScore,
        grade: result.grade,
        result: result,
      });
    }
  } catch {
    // Silently fail — analysis result is still returned even if save fails
  }

  return result;
}
