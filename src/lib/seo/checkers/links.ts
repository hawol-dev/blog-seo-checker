import { CheckResult } from '@/lib/seo/types';

interface LinksInput {
  externalLinkCount: number;
  internalLinkCount: number;
  tagCount: number;
}

const EXTERNAL_LINK_MAX_SCORE = 7;
const INTERNAL_LINK_MAX_SCORE = 4;
const TAG_MAX_SCORE = 4;

const OPTIMAL_TAG_MIN = 5;
const OPTIMAL_TAG_MAX = 10;

function checkExternalLinks(externalLinkCount: number): CheckResult {
  const name = '외부 링크';

  if (externalLinkCount === 0) {
    return {
      name,
      score: EXTERNAL_LINK_MAX_SCORE,
      maxScore: EXTERNAL_LINK_MAX_SCORE,
      status: 'pass',
    };
  }

  if (externalLinkCount === 1) {
    return {
      name,
      score: 2,
      maxScore: EXTERNAL_LINK_MAX_SCORE,
      status: 'error',
      hint: '네이버는 외부 링크 포함 글의 노출을 제한해요.',
      gainIfFixed: EXTERNAL_LINK_MAX_SCORE - 2,
    };
  }

  return {
    name,
    score: 0,
    maxScore: EXTERNAL_LINK_MAX_SCORE,
    status: 'error',
    hint: '네이버는 외부 링크 포함 글의 노출을 제한해요.',
    gainIfFixed: EXTERNAL_LINK_MAX_SCORE,
  };
}

function checkInternalLinks(internalLinkCount: number): CheckResult {
  const name = '내부 링크';

  if (internalLinkCount >= 1 && internalLinkCount <= 2) {
    return {
      name,
      score: INTERNAL_LINK_MAX_SCORE,
      maxScore: INTERNAL_LINK_MAX_SCORE,
      status: 'pass',
    };
  }

  if (internalLinkCount >= 3) {
    return {
      name,
      score: 3,
      maxScore: INTERNAL_LINK_MAX_SCORE,
      status: 'pass',
      hint: '자기 블로그 내 관련 글 링크를 1~2개 추가하면 체류시간이 늘어나요.',
      gainIfFixed: INTERNAL_LINK_MAX_SCORE - 3,
    };
  }

  return {
    name,
    score: 1,
    maxScore: INTERNAL_LINK_MAX_SCORE,
    status: 'warn',
    hint: '자기 블로그 내 관련 글 링크를 1~2개 추가하면 체류시간이 늘어나요.',
    gainIfFixed: INTERNAL_LINK_MAX_SCORE - 1,
  };
}

function checkTags(tagCount: number): CheckResult {
  const name = '태그';

  if (tagCount >= OPTIMAL_TAG_MIN && tagCount <= OPTIMAL_TAG_MAX) {
    return {
      name,
      score: TAG_MAX_SCORE,
      maxScore: TAG_MAX_SCORE,
      status: 'pass',
    };
  }

  if (tagCount > OPTIMAL_TAG_MAX) {
    return {
      name,
      score: 2,
      maxScore: TAG_MAX_SCORE,
      status: 'warn',
      hint: '태그는 5~10개가 적절해요.',
      gainIfFixed: TAG_MAX_SCORE - 2,
    };
  }

  return {
    name,
    score: 1,
    maxScore: TAG_MAX_SCORE,
    status: 'warn',
    hint: '태그는 5~10개가 적절해요.',
    gainIfFixed: TAG_MAX_SCORE - 1,
  };
}

export function checkLinks({ externalLinkCount, internalLinkCount, tagCount }: LinksInput): CheckResult[] {
  return [
    checkExternalLinks(externalLinkCount),
    checkInternalLinks(internalLinkCount),
    checkTags(tagCount),
  ];
}
