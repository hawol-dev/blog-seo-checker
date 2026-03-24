'use server';

import { createClient } from '@/lib/supabase/server';

export interface HistoryItem {
  id: string;
  title: string;
  keyword: string;
  contentLength: number;
  totalScore: number;
  grade: string;
  createdAt: string;
}

export async function getHistory(): Promise<HistoryItem[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('analyses')
    .select('id, title, keyword, content_length, total_score, grade, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw new Error('히스토리를 불러오는 데 실패했어요.');

  return (data || []).map(row => ({
    id: row.id,
    title: row.title,
    keyword: row.keyword,
    contentLength: row.content_length,
    totalScore: row.total_score,
    grade: row.grade,
    createdAt: row.created_at,
  }));
}

export async function getAnalysis(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요해요.');

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !data) throw new Error('분석 결과를 찾을 수 없어요.');

  return {
    id: data.id,
    title: data.title,
    keyword: data.keyword,
    contentLength: data.content_length,
    totalScore: data.total_score,
    grade: data.grade,
    result: data.result,
    createdAt: data.created_at,
  };
}
