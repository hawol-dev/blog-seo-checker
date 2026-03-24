import { CheckResult } from '@/lib/seo/types';

interface ReadabilityInput {
  title: string;
  content: string;
}

const CONCLUSION_MAX_SCORE = 5;
const TITLE_LENGTH_MAX_SCORE = 5;
const SPECIAL_CHAR_MAX_SCORE = 5;

const CONCLUSION_MIN_LENGTH = 10;
const TITLE_OPTIMAL_MIN = 15;
const TITLE_OPTIMAL_MAX = 30;
const TITLE_ACCEPTABLE_MIN = 10;
const TITLE_ACCEPTABLE_MAX = 40;
const SPECIAL_CHAR_PASS_MAX = 5;
const SPECIAL_CHAR_WARN_MAX = 10;

// Combined pattern: special chars + emojis in one regex to avoid double-counting
const SPECIAL_AND_EMOJI_PATTERN = /[※★☆♥♡◆◇■□▲△▼▽●○◎♣♠♦♧♤♢✓✔✗✘→←↑↓⇒⇐\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu;

function countSpecialChars(content: string): number {
  const matches = content.match(SPECIAL_AND_EMOJI_PATTERN);
  return matches?.length ?? 0;
}

function checkConclusion(content: string): CheckResult {
  const name = '맺음말';
  const paragraphs = content.split('\n\n');
  const lastParagraph = paragraphs[paragraphs.length - 1]?.trim() ?? '';

  if (paragraphs.length >= 2 && lastParagraph.length >= CONCLUSION_MIN_LENGTH) {
    return {
      name,
      score: CONCLUSION_MAX_SCORE,
      maxScore: CONCLUSION_MAX_SCORE,
      status: 'pass',
    };
  }

  return {
    name,
    score: 0,
    maxScore: CONCLUSION_MAX_SCORE,
    status: 'error',
    hint: '글 마무리 문단을 추가해주세요.',
    gainIfFixed: CONCLUSION_MAX_SCORE,
  };
}

function checkTitleLength(title: string): CheckResult {
  const name = '제목 길이';
  const length = title.length;

  if (length >= TITLE_OPTIMAL_MIN && length <= TITLE_OPTIMAL_MAX) {
    return {
      name,
      score: TITLE_LENGTH_MAX_SCORE,
      maxScore: TITLE_LENGTH_MAX_SCORE,
      status: 'pass',
    };
  }

  if (
    (length >= TITLE_ACCEPTABLE_MIN && length < TITLE_OPTIMAL_MIN) ||
    (length > TITLE_OPTIMAL_MAX && length <= TITLE_ACCEPTABLE_MAX)
  ) {
    return {
      name,
      score: 3,
      maxScore: TITLE_LENGTH_MAX_SCORE,
      status: 'warn',
      hint: '제목은 15~30자가 검색 결과에서 가장 잘 보여요.',
      gainIfFixed: TITLE_LENGTH_MAX_SCORE - 3,
    };
  }

  return {
    name,
    score: 1,
    maxScore: TITLE_LENGTH_MAX_SCORE,
    status: 'error',
    hint: '제목은 15~30자가 검색 결과에서 가장 잘 보여요.',
    gainIfFixed: TITLE_LENGTH_MAX_SCORE - 1,
  };
}

function checkSpecialChars(content: string): CheckResult {
  const name = '전체 가독성';
  const count = countSpecialChars(content);

  if (count <= SPECIAL_CHAR_PASS_MAX) {
    return {
      name,
      score: SPECIAL_CHAR_MAX_SCORE,
      maxScore: SPECIAL_CHAR_MAX_SCORE,
      status: 'pass',
    };
  }

  if (count <= SPECIAL_CHAR_WARN_MAX) {
    return {
      name,
      score: 3,
      maxScore: SPECIAL_CHAR_MAX_SCORE,
      status: 'warn',
      hint: '이모지/특수문자는 5개 이하로 줄이면 D.I.A.에서 더 좋은 평가를 받아요.',
      gainIfFixed: SPECIAL_CHAR_MAX_SCORE - 3,
    };
  }

  return {
    name,
    score: 1,
    maxScore: SPECIAL_CHAR_MAX_SCORE,
    status: 'warn',
    hint: '이모지/특수문자는 5개 이하로 줄이면 D.I.A.에서 더 좋은 평가를 받아요.',
    gainIfFixed: SPECIAL_CHAR_MAX_SCORE - 1,
  };
}

export function checkReadability({ title, content }: ReadabilityInput): CheckResult[] {
  return [
    checkConclusion(content),
    checkTitleLength(title),
    checkSpecialChars(content),
  ];
}
