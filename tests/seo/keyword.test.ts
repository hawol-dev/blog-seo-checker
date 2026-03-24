import { describe, it, expect } from 'vitest';
import { checkKeyword } from '@/lib/seo/checkers/keyword';

describe('keyword checker', () => {
  const base = { title: '제주도 맛집 추천 BEST 7', keyword: '제주도 맛집 추천', content: '' };

  it('gives 10/10 when keyword starts the title', () => {
    const result = checkKeyword({ ...base, title: '제주도 맛집 추천 완벽 가이드' });
    const check = result.find(c => c.name === '제목 내 키워드');
    expect(check?.score).toBe(10);
  });

  it('gives 7/10 when keyword exists but not at start', () => {
    const result = checkKeyword({ ...base, title: '완벽 가이드 — 제주도 맛집 추천' });
    expect(result.find(c => c.name === '제목 내 키워드')?.score).toBe(7);
  });

  it('gives 0/10 when keyword is missing', () => {
    const result = checkKeyword({ ...base, title: '여행 가이드' });
    expect(result.find(c => c.name === '제목 내 키워드')?.score).toBe(0);
  });

  it('gives 8/8 for 1-3% keyword density', () => {
    const content = '제주도 맛집 추천 정보입니다. '.repeat(10) + '가'.repeat(200);
    const result = checkKeyword({ ...base, content });
    expect(result.find(c => c.name === '키워드 밀도')?.status).toBe('pass');
  });

  it('warns for density over 3%', () => {
    const content = '제주도 맛집 추천 '.repeat(50);
    const result = checkKeyword({ ...base, content });
    expect(result.find(c => c.name === '키워드 밀도')?.status).not.toBe('pass');
  });

  it('gives 7/7 when keyword in first 100 chars', () => {
    const content = '오늘은 제주도 맛집 추천을 해볼게요. ' + '내용 '.repeat(200);
    const result = checkKeyword({ ...base, content });
    expect(result.find(c => c.name === '첫 문단 키워드')?.score).toBe(7);
  });

  it('gives 0/7 when keyword absent from first 100 chars', () => {
    const content = '오늘은 여행 이야기를 해볼게요. '.repeat(6) + '제주도 맛집 추천';
    const result = checkKeyword({ ...base, content });
    expect(result.find(c => c.name === '첫 문단 키워드')?.score).toBe(0);
  });
});
