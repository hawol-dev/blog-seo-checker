'use server';

import { createClient } from '@/lib/supabase/server';

const FREE_DAILY_LIMIT = 3;

export async function getTodayUsage(): Promise<{ used: number; limit: number; isLimited: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { used: 0, limit: FREE_DAILY_LIMIT, isLimited: false };

  // TODO: Check user plan (free vs pro) — for now assume free
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from('analyses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', today.toISOString());

  if (error) throw new Error('사용량을 확인하는 데 실패했어요.');

  const used = count ?? 0;
  return {
    used,
    limit: FREE_DAILY_LIMIT,
    isLimited: used >= FREE_DAILY_LIMIT,
  };
}

export async function checkUsageLimit(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Guests have no DB records — skip server-side rate limiting
  if (!user) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from('analyses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', today.toISOString());

  if (error) throw new Error('사용량을 확인하는 데 실패했어요.');

  const used = count ?? 0;
  if (used >= FREE_DAILY_LIMIT) {
    throw new Error(`오늘 무료 분석 횟수(${FREE_DAILY_LIMIT}회)를 모두 사용했어요. 내일 다시 시도해주세요.`);
  }
}
