import { describe, it, expect } from 'vitest';
import { checkStructure } from '@/lib/seo/checkers/structure';

describe('structure checker', () => {
  describe('character count (10pts)', () => {
    it('gives 10/10 for 2000-5000 chars', () => {
      const result = checkStructure({ content: '가'.repeat(3000) });
      expect(result.find(c => c.name === '글자수')?.score).toBe(10);
    });

    it('gives 8/10 for 5001+ chars', () => {
      const result = checkStructure({ content: '가'.repeat(6000) });
      expect(result.find(c => c.name === '글자수')?.score).toBe(8);
    });

    it('gives 7/10 for 1500-1999 chars', () => {
      const result = checkStructure({ content: '가'.repeat(1700) });
      expect(result.find(c => c.name === '글자수')?.score).toBe(7);
    });

    it('gives 5/10 for 1000-1499 chars', () => {
      const result = checkStructure({ content: '가'.repeat(1200) });
      expect(result.find(c => c.name === '글자수')?.score).toBe(5);
    });

    it('gives 3/10 for 500-999 chars', () => {
      const result = checkStructure({ content: '가'.repeat(700) });
      expect(result.find(c => c.name === '글자수')?.score).toBe(3);
    });

    it('gives 0/10 for under 500 chars', () => {
      const result = checkStructure({ content: '가'.repeat(300) });
      expect(result.find(c => c.name === '글자수')?.score).toBe(0);
    });
  });

  describe('subheadings (8pts)', () => {
    it('gives 8/8 for 2+ ## subheadings', () => {
      const content = '인트로\n## 소제목1\n내용\n## 소제목2\n내용';
      const result = checkStructure({ content });
      expect(result.find(c => c.name === '소제목 구조')?.score).toBe(8);
    });

    it('gives 8/8 for ** style subheadings', () => {
      const content = '인트로\n**소제목1**\n내용\n**소제목2**\n내용';
      const result = checkStructure({ content });
      expect(result.find(c => c.name === '소제목 구조')?.score).toBe(8);
    });

    it('gives 4/8 for 1 subheading', () => {
      const content = '인트로\n## 소제목1\n내용만 있음';
      const result = checkStructure({ content });
      expect(result.find(c => c.name === '소제목 구조')?.score).toBe(4);
    });

    it('gives 0/8 for no subheadings', () => {
      const result = checkStructure({ content: '그냥 글만 있는 본문입니다.' });
      expect(result.find(c => c.name === '소제목 구조')?.score).toBe(0);
    });
  });

  describe('paragraph length (7pts)', () => {
    it('gives 7/7 when most paragraphs are short', () => {
      const content = '짧은 문단.\n두 줄.\n\n또 짧은 문단.\n세 줄.\n마지막.\n\n끝.';
      const result = checkStructure({ content });
      expect(result.find(c => c.name === '문단 길이')?.score).toBe(7);
    });

    it('gives 2/7 when paragraphs are long', () => {
      const content = '줄1\n줄2\n줄3\n줄4\n줄5\n줄6\n\n또줄1\n줄2\n줄3\n줄4\n줄5\n줄6';
      const result = checkStructure({ content });
      expect(result.find(c => c.name === '문단 길이')?.score).toBe(2);
    });
  });
});
