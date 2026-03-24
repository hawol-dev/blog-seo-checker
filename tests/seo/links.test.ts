import { describe, it, expect } from 'vitest';
import { checkLinks } from '@/lib/seo/checkers/links';

describe('links checker', () => {
  // ─── External Links (7pts) ───
  describe('외부 링크', () => {
    it('gives 7/7 when 0 external links', () => {
      const results = checkLinks({ externalLinkCount: 0, internalLinkCount: 0, tagCount: 5 });
      const check = results.find(c => c.name === '외부 링크');
      expect(check?.score).toBe(7);
      expect(check?.status).toBe('pass');
    });

    it('gives 2/7 when 1 external link', () => {
      const results = checkLinks({ externalLinkCount: 1, internalLinkCount: 0, tagCount: 5 });
      const check = results.find(c => c.name === '외부 링크');
      expect(check?.score).toBe(2);
      expect(check?.status).toBe('error');
    });

    it('gives 0/7 when 2+ external links', () => {
      const results = checkLinks({ externalLinkCount: 3, internalLinkCount: 0, tagCount: 5 });
      const check = results.find(c => c.name === '외부 링크');
      expect(check?.score).toBe(0);
      expect(check?.status).toBe('error');
    });
  });

  // ─── Internal Links (4pts) ───
  describe('내부 링크', () => {
    it('gives 1/4 when 0 internal links', () => {
      const results = checkLinks({ externalLinkCount: 0, internalLinkCount: 0, tagCount: 5 });
      const check = results.find(c => c.name === '내부 링크');
      expect(check?.score).toBe(1);
      expect(check?.status).toBe('warn');
    });

    it('gives 4/4 when 1-2 internal links', () => {
      const results = checkLinks({ externalLinkCount: 0, internalLinkCount: 2, tagCount: 5 });
      const check = results.find(c => c.name === '내부 링크');
      expect(check?.score).toBe(4);
      expect(check?.status).toBe('pass');
    });

    it('gives 3/4 when 3+ internal links', () => {
      const results = checkLinks({ externalLinkCount: 0, internalLinkCount: 5, tagCount: 5 });
      const check = results.find(c => c.name === '내부 링크');
      expect(check?.score).toBe(3);
      expect(check?.status).toBe('pass');
    });
  });

  // ─── Tags (4pts) ───
  describe('태그', () => {
    it('gives 1/4 when 0-4 tags', () => {
      const results = checkLinks({ externalLinkCount: 0, internalLinkCount: 0, tagCount: 3 });
      const check = results.find(c => c.name === '태그');
      expect(check?.score).toBe(1);
      expect(check?.status).toBe('warn');
    });

    it('gives 4/4 when 5-10 tags', () => {
      const results = checkLinks({ externalLinkCount: 0, internalLinkCount: 0, tagCount: 7 });
      const check = results.find(c => c.name === '태그');
      expect(check?.score).toBe(4);
      expect(check?.status).toBe('pass');
    });

    it('gives 2/4 when 11+ tags', () => {
      const results = checkLinks({ externalLinkCount: 0, internalLinkCount: 0, tagCount: 15 });
      const check = results.find(c => c.name === '태그');
      expect(check?.score).toBe(2);
      expect(check?.status).toBe('warn');
    });
  });

  // ─── Return shape ───
  it('returns exactly 3 check results', () => {
    const results = checkLinks({ externalLinkCount: 0, internalLinkCount: 1, tagCount: 5 });
    expect(results).toHaveLength(3);
  });
});
