import { describe, it, expect } from 'vitest';
import { checkMedia } from '@/lib/seo/checkers/media';

describe('media checker', () => {
  // ─── Image Count (8pts) ───
  describe('이미지 수', () => {
    it('gives 0/8 when no images', () => {
      const results = checkMedia({ content: 'a'.repeat(500), imageCount: 0, videoCount: 0 });
      const check = results.find(c => c.name === '이미지 수');
      expect(check?.score).toBe(0);
      expect(check?.status).toBe('error');
    });

    it('gives 4/8 when 1-2 images', () => {
      const results = checkMedia({ content: 'a'.repeat(500), imageCount: 2, videoCount: 0 });
      const check = results.find(c => c.name === '이미지 수');
      expect(check?.score).toBe(4);
      expect(check?.status).toBe('warn');
    });

    it('gives 8/8 when 3+ images', () => {
      const results = checkMedia({ content: 'a'.repeat(500), imageCount: 5, videoCount: 0 });
      const check = results.find(c => c.name === '이미지 수');
      expect(check?.score).toBe(8);
      expect(check?.status).toBe('pass');
    });
  });

  // ─── Image Spacing (7pts) ───
  describe('이미지 간격', () => {
    it('gives 0/7 when no images', () => {
      const results = checkMedia({ content: 'a'.repeat(500), imageCount: 0, videoCount: 0 });
      const check = results.find(c => c.name === '이미지 간격');
      expect(check?.score).toBe(0);
    });

    it('gives 7/7 when avgSpacing 250-600', () => {
      // 1500 / 5 = 300 → pass
      const results = checkMedia({ content: 'a'.repeat(1500), imageCount: 5, videoCount: 0 });
      const check = results.find(c => c.name === '이미지 간격');
      expect(check?.score).toBe(7);
      expect(check?.status).toBe('pass');
    });

    it('gives 5/7 when avgSpacing 150-249 or 601-800', () => {
      // 1600 / 2 = 800 → warn
      const results = checkMedia({ content: 'a'.repeat(1600), imageCount: 2, videoCount: 0 });
      const check = results.find(c => c.name === '이미지 간격');
      expect(check?.score).toBe(5);
      expect(check?.status).toBe('warn');
    });

    it('gives 5/7 when avgSpacing is 150-249', () => {
      // 200 / 1 = 200 → warn
      const results = checkMedia({ content: 'a'.repeat(200), imageCount: 1, videoCount: 0 });
      const check = results.find(c => c.name === '이미지 간격');
      expect(check?.score).toBe(5);
      expect(check?.status).toBe('warn');
    });

    it('gives 2/7 when avgSpacing outside 150-800', () => {
      // 100 / 1 = 100 → warn (too low)
      const results = checkMedia({ content: 'a'.repeat(100), imageCount: 1, videoCount: 0 });
      const check = results.find(c => c.name === '이미지 간격');
      expect(check?.score).toBe(2);
      expect(check?.status).toBe('warn');
    });

    it('gives 2/7 when avgSpacing is too high (>800)', () => {
      // 5000 / 1 = 5000 → warn
      const results = checkMedia({ content: 'a'.repeat(5000), imageCount: 1, videoCount: 0 });
      const check = results.find(c => c.name === '이미지 간격');
      expect(check?.score).toBe(2);
      expect(check?.status).toBe('warn');
    });
  });

  // ─── Video Inclusion (5pts) ───
  describe('동영상 포함', () => {
    it('gives 0/5 when no videos', () => {
      const results = checkMedia({ content: 'a'.repeat(500), imageCount: 3, videoCount: 0 });
      const check = results.find(c => c.name === '동영상 포함');
      expect(check?.score).toBe(0);
      expect(check?.status).toBe('warn');
    });

    it('gives 5/5 when 1+ videos', () => {
      const results = checkMedia({ content: 'a'.repeat(500), imageCount: 3, videoCount: 2 });
      const check = results.find(c => c.name === '동영상 포함');
      expect(check?.score).toBe(5);
      expect(check?.status).toBe('pass');
    });
  });

  // ─── Return shape ───
  it('returns exactly 3 check results', () => {
    const results = checkMedia({ content: 'a'.repeat(500), imageCount: 3, videoCount: 1 });
    expect(results).toHaveLength(3);
  });
});
