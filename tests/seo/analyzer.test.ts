import { describe, it, expect } from 'vitest';
import { analyze } from '@/lib/seo/analyzer';

function makeSection(heading: string, text: string, repeats: number): string {
  let result = `## ${heading}\n`;
  for (let i = 0; i < repeats; i++) {
    result += `${text}\n\n`;
  }
  return result;
}

describe('analyzer orchestrator', () => {
  it('returns 15 checks with total score and grade', () => {
    const content =
      '제주도 맛집 추천을 소개합니다.\n\n' +
      makeSection('흑돼지 거리', '맛있는 흑돼지를 먹으러 가보자. 제주에서 유명한 곳이다.', 20) +
      makeSection('해산물 맛집', '신선한 해산물이 가득. 제주도 맛집 추천 리스트에 빠질 수 없다.', 20) +
      makeSection('카페 투어', '감성 카페가 많은 제주. 제주도 맛집 추천 여행의 마무리.', 20) +
      '제주도 맛집 추천을 마칩니다. 제주도 여행에서 꼭 방문해보세요.';

    const result = analyze({
      title: '제주도 맛집 추천 BEST 7',
      keyword: '제주도 맛집 추천',
      content,
      imageCount: 5,
      videoCount: 1,
      tagCount: 8,
      externalLinkCount: 0,
      internalLinkCount: 2,
    });
    expect(result.checks).toHaveLength(15);
    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.totalScore).toBeLessThanOrEqual(100);
    expect(['S', 'A', 'B', 'C', 'D']).toContain(result.grade);
    expect(result.gradeMessage).toBeTruthy();
  });

  it('gives S grade for near-perfect input', () => {
    const content =
      '제주도 맛집 추천을 소개합니다.\n\n' +
      makeSection('흑돼지 거리', '맛있는 흑돼지를 먹으러 가보자. 제주에서 유명한 곳이다.', 20) +
      makeSection('해산물 맛집', '신선한 해산물이 가득. 제주도 맛집 추천 리스트에 빠질 수 없다.', 20) +
      makeSection('카페 투어', '감성 카페가 많은 제주. 제주도 맛집 추천 여행의 마무리.', 20) +
      '제주도 맛집 추천을 마칩니다. 제주도 여행에서 꼭 방문해보세요.';

    const result = analyze({
      title: '제주도 맛집 추천 BEST 7 현지인 찐맛집',
      keyword: '제주도 맛집 추천',
      content,
      imageCount: 5, videoCount: 1, tagCount: 8,
      externalLinkCount: 0, internalLinkCount: 2,
    });
    expect(result.grade).toBe('S');
    expect(result.totalScore).toBeGreaterThanOrEqual(90);
  });

  it('gives low grade for poor input', () => {
    const result = analyze({
      title: '글',
      keyword: '제주도 맛집',
      content: '짧은 글.',
      imageCount: 0, videoCount: 0, tagCount: 0,
      externalLinkCount: 3, internalLinkCount: 0,
    });
    expect(result.grade).toBe('D');
    expect(result.totalScore).toBeLessThan(40);
  });

  it('sorts checks by status: error first, then warn, then pass', () => {
    const result = analyze({
      title: '제주도 맛집 추천',
      keyword: '제주도 맛집 추천',
      content: '제주도 맛집 추천 소개.\n\n## 소제목\n내용\n\n## 소제목2\n내용\n\n맺음말.',
      imageCount: 2, videoCount: 0, tagCount: 3,
      externalLinkCount: 1, internalLinkCount: 0,
    });
    const statuses = result.checks.map(c => c.status);
    const errorIdx = statuses.findIndex(s => s === 'error');
    const warnIdx = statuses.findIndex(s => s === 'warn');
    const passIdx = statuses.findIndex(s => s === 'pass');
    // errors should come before warns, warns before passes
    if (errorIdx !== -1 && warnIdx !== -1) expect(errorIdx).toBeLessThan(warnIdx);
    if (warnIdx !== -1 && passIdx !== -1) expect(warnIdx).toBeLessThan(passIdx);
  });
});
