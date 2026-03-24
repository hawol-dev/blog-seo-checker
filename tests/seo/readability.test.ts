import { describe, it, expect } from 'vitest';
import { checkReadability } from '@/lib/seo/checkers/readability';

describe('readability checker', () => {
  const baseTitle = '제주도 맛집 추천 베스트 7선';

  // ─── Conclusion / 맺음말 (5pts) ───
  describe('맺음말', () => {
    it('gives 5/5 when last paragraph has 10+ characters', () => {
      const content = '첫 번째 문단입니다.\n\n이것은 충분히 긴 맺음말 문단입니다.';
      const results = checkReadability({ title: baseTitle, content });
      const check = results.find(c => c.name === '맺음말');
      expect(check?.score).toBe(5);
      expect(check?.status).toBe('pass');
    });

    it('gives 0/5 when last paragraph has fewer than 10 characters', () => {
      const content = '첫 번째 문단입니다.\n\n짧아요';
      const results = checkReadability({ title: baseTitle, content });
      const check = results.find(c => c.name === '맺음말');
      expect(check?.score).toBe(0);
      expect(check?.status).toBe('error');
    });

    it('gives 0/5 when content has no paragraph separator', () => {
      const content = '짧은글';
      const results = checkReadability({ title: baseTitle, content });
      const check = results.find(c => c.name === '맺음말');
      expect(check?.score).toBe(0);
      expect(check?.status).toBe('error');
    });

    it('gives 5/5 when content has multiple paragraphs and long conclusion', () => {
      const content = '첫 문단\n\n중간 문단\n\n마지막 문단은 꽤 길게 작성되었습니다 이것은 맺음말입니다.';
      const results = checkReadability({ title: baseTitle, content });
      const check = results.find(c => c.name === '맺음말');
      expect(check?.score).toBe(5);
      expect(check?.status).toBe('pass');
    });
  });

  // ─── Title Length (5pts) ───
  describe('제목 길이', () => {
    it('gives 5/5 when title is 15-30 chars', () => {
      // 15 chars
      const results = checkReadability({ title: '가나다라마바사아자차카타파하아', content: '내용\n\n맺음말 문단입니다 충분히 긴' });
      const check = results.find(c => c.name === '제목 길이');
      expect(check?.score).toBe(5);
      expect(check?.status).toBe('pass');
    });

    it('gives 3/5 when title is 10-14 chars', () => {
      // 12 chars
      const results = checkReadability({ title: '가나다라마바사아자차카타', content: '내용\n\n맺음말 문단입니다 충분히 긴' });
      const check = results.find(c => c.name === '제목 길이');
      expect(check?.score).toBe(3);
      expect(check?.status).toBe('warn');
    });

    it('gives 3/5 when title is 31-40 chars', () => {
      // 35 chars
      const title = '가'.repeat(35);
      const results = checkReadability({ title, content: '내용\n\n맺음말 문단입니다 충분히 긴' });
      const check = results.find(c => c.name === '제목 길이');
      expect(check?.score).toBe(3);
      expect(check?.status).toBe('warn');
    });

    it('gives 1/5 when title is too short (<10 chars)', () => {
      const results = checkReadability({ title: '짧은제목', content: '내용\n\n맺음말 문단입니다 충분히 긴' });
      const check = results.find(c => c.name === '제목 길이');
      expect(check?.score).toBe(1);
      expect(check?.status).toBe('error');
    });

    it('gives 1/5 when title is too long (>40 chars)', () => {
      const title = '가'.repeat(45);
      const results = checkReadability({ title, content: '내용\n\n맺음말 문단입니다 충분히 긴' });
      const check = results.find(c => c.name === '제목 길이');
      expect(check?.score).toBe(1);
      expect(check?.status).toBe('error');
    });
  });

  // ─── Readability / emoji & special chars (5pts) ───
  describe('전체 가독성', () => {
    it('gives 5/5 when 0-5 special chars', () => {
      const content = '깔끔한 글입니다. 특수문자가 없어요.\n\n맺음말 문단입니다 충분히 긴';
      const results = checkReadability({ title: baseTitle, content });
      const check = results.find(c => c.name === '전체 가독성');
      expect(check?.score).toBe(5);
      expect(check?.status).toBe('pass');
    });

    it('gives 3/5 when 6-10 special chars', () => {
      const content = '★★★★★★ 특수문자 포함 글\n\n맺음말 문단입니다 충분히 긴';
      const results = checkReadability({ title: baseTitle, content });
      const check = results.find(c => c.name === '전체 가독성');
      expect(check?.score).toBe(3);
      expect(check?.status).toBe('warn');
    });

    it('gives 1/5 when 11+ special chars', () => {
      const content = '★★★★★★★★★★★ 엄청 많은 특수문자\n\n맺음말 문단입니다 충분히 긴';
      const results = checkReadability({ title: baseTitle, content });
      const check = results.find(c => c.name === '전체 가독성');
      expect(check?.score).toBe(1);
      expect(check?.status).toBe('warn');
    });

    it('counts emojis as special characters', () => {
      const content = '😀😁😂🤣😃😄😅😆😇😈😉 이모지 많은 글\n\n맺음말 문단입니다 충분히 긴';
      const results = checkReadability({ title: baseTitle, content });
      const check = results.find(c => c.name === '전체 가독성');
      expect(check?.score).toBe(1);
      expect(check?.status).toBe('warn');
    });

    it('counts mixed special chars and emojis', () => {
      // 3 special chars + 3 emojis = 6 → warn tier
      const content = '※★♥ 😀😁😂 글 내용\n\n맺음말 문단입니다 충분히 긴';
      const results = checkReadability({ title: baseTitle, content });
      const check = results.find(c => c.name === '전체 가독성');
      expect(check?.score).toBe(3);
      expect(check?.status).toBe('warn');
    });
  });

  // ─── Return shape ───
  it('returns exactly 3 check results', () => {
    const results = checkReadability({ title: baseTitle, content: '내용\n\n맺음말 문단입니다 충분히 긴' });
    expect(results).toHaveLength(3);
  });
});
