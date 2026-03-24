import { describe, it, expect } from 'vitest';
import { getGrade } from '@/lib/seo/grade';

describe('grade system', () => {
  it('returns S for 90+', () => expect(getGrade(95).grade).toBe('S'));
  it('returns A for 75-89', () => expect(getGrade(80).grade).toBe('A'));
  it('returns B for 60-74', () => expect(getGrade(65).grade).toBe('B'));
  it('returns C for 40-59', () => expect(getGrade(50).grade).toBe('C'));
  it('returns D for 0-39', () => expect(getGrade(20).grade).toBe('D'));
  it('returns Korean message', () => expect(getGrade(95).message).toContain('상위노출'));
});
