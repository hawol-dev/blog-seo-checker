import { CheckResult } from '@/lib/seo/types';

interface StructureInput {
  content: string;
}

const CHAR_COUNT_MAX_SCORE = 10;
const SUBHEADING_MAX_SCORE = 8;
const PARAGRAPH_MAX_SCORE = 7;

const SHORT_PARAGRAPH_MAX_LINES = 4;
const SHORT_PARAGRAPH_HIGH_RATIO = 0.7;
const SHORT_PARAGRAPH_MID_RATIO = 0.5;

// Pattern: line starting with ## or line that is entirely wrapped in **...**
const SUBHEADING_PATTERN = /^(?:##\s|^\*\*.+\*\*$)/;

function checkCharCount(content: string): CheckResult {
  const name = '글자수';
  const length = content.length;

  if (length >= 2000 && length <= 5000) {
    return {
      name,
      score: CHAR_COUNT_MAX_SCORE,
      maxScore: CHAR_COUNT_MAX_SCORE,
      status: 'pass',
    };
  }

  if (length > 5000) {
    return {
      name,
      score: 8,
      maxScore: CHAR_COUNT_MAX_SCORE,
      status: 'pass',
      hint: '글이 다소 길어요. 핵심 내용에 집중하면 가독성이 올라가요.',
      gainIfFixed: CHAR_COUNT_MAX_SCORE - 8,
    };
  }

  if (length >= 1500) {
    return {
      name,
      score: 7,
      maxScore: CHAR_COUNT_MAX_SCORE,
      status: 'pass',
      hint: '조금만 더 작성하면 최적 글자수(2000자 이상)에 도달해요.',
      gainIfFixed: CHAR_COUNT_MAX_SCORE - 7,
    };
  }

  if (length >= 1000) {
    return {
      name,
      score: 5,
      maxScore: CHAR_COUNT_MAX_SCORE,
      status: 'warn',
      hint: '글자수가 부족해요. 2000자 이상 작성하면 SEO에 유리해요.',
      gainIfFixed: CHAR_COUNT_MAX_SCORE - 5,
    };
  }

  if (length >= 500) {
    return {
      name,
      score: 3,
      maxScore: CHAR_COUNT_MAX_SCORE,
      status: 'warn',
      hint: '글자수가 많이 부족해요. 최소 1500자 이상 작성을 권장해요.',
      gainIfFixed: CHAR_COUNT_MAX_SCORE - 3,
    };
  }

  return {
    name,
    score: 0,
    maxScore: CHAR_COUNT_MAX_SCORE,
    status: 'error',
    hint: '글자수가 500자 미만이에요. 검색엔진이 충분한 콘텐츠로 인식하지 못할 수 있어요.',
    gainIfFixed: CHAR_COUNT_MAX_SCORE,
  };
}

function countSubheadings(content: string): number {
  const lines = content.split('\n');
  let count = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ') || (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4)) {
      count++;
    }
  }

  return count;
}

function checkSubheadings(content: string): CheckResult {
  const name = '소제목 구조';
  const count = countSubheadings(content);

  if (count >= 2) {
    return {
      name,
      score: SUBHEADING_MAX_SCORE,
      maxScore: SUBHEADING_MAX_SCORE,
      status: 'pass',
    };
  }

  if (count === 1) {
    return {
      name,
      score: 4,
      maxScore: SUBHEADING_MAX_SCORE,
      status: 'warn',
      hint: '소제목이 1개뿐이에요. 2개 이상 사용하면 구조가 명확해져요.',
      gainIfFixed: SUBHEADING_MAX_SCORE - 4,
    };
  }

  return {
    name,
    score: 0,
    maxScore: SUBHEADING_MAX_SCORE,
    status: 'error',
    hint: '소제목이 없어요. ## 또는 **굵은 글씨**로 소제목을 추가하면 가독성과 SEO가 좋아져요.',
    gainIfFixed: SUBHEADING_MAX_SCORE,
  };
}

function checkParagraphLength(content: string): CheckResult {
  const name = '문단 길이';
  const paragraphs = content.split('\n\n');

  if (paragraphs.length <= 1) {
    return {
      name,
      score: 2,
      maxScore: PARAGRAPH_MAX_SCORE,
      status: 'warn',
      hint: '문단 구분이 없어요. 빈 줄로 문단을 나누면 가독성이 크게 향상돼요.',
      gainIfFixed: PARAGRAPH_MAX_SCORE - 2,
    };
  }

  const shortParagraphCount = paragraphs.filter(p => {
    const lines = p.split('\n').filter(line => line.trim().length > 0);
    return lines.length <= SHORT_PARAGRAPH_MAX_LINES;
  }).length;

  const shortRatio = shortParagraphCount / paragraphs.length;

  if (shortRatio > SHORT_PARAGRAPH_HIGH_RATIO) {
    return {
      name,
      score: PARAGRAPH_MAX_SCORE,
      maxScore: PARAGRAPH_MAX_SCORE,
      status: 'pass',
    };
  }

  if (shortRatio > SHORT_PARAGRAPH_MID_RATIO) {
    return {
      name,
      score: 4,
      maxScore: PARAGRAPH_MAX_SCORE,
      status: 'warn',
      hint: '일부 문단이 길어요. 4줄 이하로 나누면 모바일에서 읽기 편해요.',
      gainIfFixed: PARAGRAPH_MAX_SCORE - 4,
    };
  }

  return {
    name,
    score: 2,
    maxScore: PARAGRAPH_MAX_SCORE,
    status: 'warn',
    hint: '문단이 전체적으로 길어요. 짧은 문단으로 나누면 가독성이 좋아져요.',
    gainIfFixed: PARAGRAPH_MAX_SCORE - 2,
  };
}

export function checkStructure({ content }: StructureInput): CheckResult[] {
  return [
    checkCharCount(content),
    checkSubheadings(content),
    checkParagraphLength(content),
  ];
}
