import { CheckResult } from '@/lib/seo/types';

interface KeywordInput {
  title: string;
  keyword: string;
  content: string;
}

const TITLE_MAX_SCORE = 10;
const DENSITY_MAX_SCORE = 8;
const FIRST_PARAGRAPH_MAX_SCORE = 7;
const FIRST_PARAGRAPH_CHAR_LIMIT = 100;
const DENSITY_MIN_PERCENT = 1;
const DENSITY_MAX_PERCENT = 3;

function countOccurrences(text: string, keyword: string): number {
  if (!keyword) return 0;

  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  let count = 0;
  let position = 0;

  while (true) {
    const index = lowerText.indexOf(lowerKeyword, position);
    if (index === -1) break;
    count++;
    position = index + lowerKeyword.length;
  }

  return count;
}

function includesKeyword(text: string, keyword: string): boolean {
  return text.toLowerCase().includes(keyword.toLowerCase());
}

function startsWithKeyword(text: string, keyword: string): boolean {
  return text.toLowerCase().startsWith(keyword.toLowerCase());
}

function checkTitleKeyword(title: string, keyword: string): CheckResult {
  const name = '제목 내 키워드';

  if (startsWithKeyword(title, keyword)) {
    return {
      name,
      score: TITLE_MAX_SCORE,
      maxScore: TITLE_MAX_SCORE,
      status: 'pass',
    };
  }

  if (includesKeyword(title, keyword)) {
    return {
      name,
      score: 7,
      maxScore: TITLE_MAX_SCORE,
      status: 'warn',
      hint: '키워드를 제목 앞부분에 배치하면 SEO에 더 유리해요.',
      gainIfFixed: TITLE_MAX_SCORE - 7,
    };
  }

  return {
    name,
    score: 0,
    maxScore: TITLE_MAX_SCORE,
    status: 'error',
    hint: '제목에 키워드가 포함되어 있지 않아요. 키워드를 제목 앞부분에 넣어보세요.',
    gainIfFixed: TITLE_MAX_SCORE,
  };
}

function checkKeywordDensity(content: string, keyword: string): CheckResult {
  const name = '키워드 밀도';

  if (!content || !keyword) {
    return {
      name,
      score: 0,
      maxScore: DENSITY_MAX_SCORE,
      status: 'error',
      hint: '콘텐츠에 키워드를 자연스럽게 포함시켜 주세요.',
      gainIfFixed: DENSITY_MAX_SCORE,
    };
  }

  const occurrences = countOccurrences(content, keyword);
  const density = (occurrences / content.length) * 100;

  if (density >= DENSITY_MIN_PERCENT && density <= DENSITY_MAX_PERCENT) {
    return {
      name,
      score: DENSITY_MAX_SCORE,
      maxScore: DENSITY_MAX_SCORE,
      status: 'pass',
    };
  }

  if (density > DENSITY_MAX_PERCENT) {
    return {
      name,
      score: 3,
      maxScore: DENSITY_MAX_SCORE,
      status: 'warn',
      hint: `키워드 밀도가 ${density.toFixed(1)}%로 너무 높아요. 자연스러운 문장으로 조절해 주세요.`,
      gainIfFixed: DENSITY_MAX_SCORE - 3,
    };
  }

  if (occurrences > 0) {
    return {
      name,
      score: 4,
      maxScore: DENSITY_MAX_SCORE,
      status: 'warn',
      hint: `키워드 밀도가 ${density.toFixed(1)}%로 낮아요. 키워드를 조금 더 활용해 보세요.`,
      gainIfFixed: DENSITY_MAX_SCORE - 4,
    };
  }

  return {
    name,
    score: 0,
    maxScore: DENSITY_MAX_SCORE,
    status: 'error',
    hint: '콘텐츠에 키워드가 전혀 없어요. 자연스럽게 키워드를 포함시켜 주세요.',
    gainIfFixed: DENSITY_MAX_SCORE,
  };
}

function checkFirstParagraphKeyword(content: string, keyword: string): CheckResult {
  const name = '첫 문단 키워드';
  const firstParagraph = content.slice(0, FIRST_PARAGRAPH_CHAR_LIMIT);

  if (includesKeyword(firstParagraph, keyword)) {
    return {
      name,
      score: FIRST_PARAGRAPH_MAX_SCORE,
      maxScore: FIRST_PARAGRAPH_MAX_SCORE,
      status: 'pass',
    };
  }

  return {
    name,
    score: 0,
    maxScore: FIRST_PARAGRAPH_MAX_SCORE,
    status: 'error',
    hint: '글 첫 100자 안에 키워드를 넣으면 검색엔진이 주제를 빠르게 파악할 수 있어요.',
    gainIfFixed: FIRST_PARAGRAPH_MAX_SCORE,
  };
}

export function checkKeyword({ title, keyword, content }: KeywordInput): CheckResult[] {
  return [
    checkTitleKeyword(title, keyword),
    checkKeywordDensity(content, keyword),
    checkFirstParagraphKeyword(content, keyword),
  ];
}
