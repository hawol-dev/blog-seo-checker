import { CheckResult } from '@/lib/seo/types';

interface MediaInput {
  content: string;
  imageCount: number;
  videoCount: number;
}

const IMAGE_COUNT_MAX_SCORE = 8;
const IMAGE_SPACING_MAX_SCORE = 7;
const VIDEO_MAX_SCORE = 5;

const OPTIMAL_SPACING_MIN = 250;
const OPTIMAL_SPACING_MAX = 600;
const ACCEPTABLE_SPACING_MIN = 150;
const ACCEPTABLE_SPACING_MAX = 800;
const MIN_OPTIMAL_IMAGE_COUNT = 3;

function checkImageCount(imageCount: number): CheckResult {
  const name = '이미지 수';

  if (imageCount >= MIN_OPTIMAL_IMAGE_COUNT) {
    return {
      name,
      score: IMAGE_COUNT_MAX_SCORE,
      maxScore: IMAGE_COUNT_MAX_SCORE,
      status: 'pass',
    };
  }

  if (imageCount >= 1) {
    return {
      name,
      score: 4,
      maxScore: IMAGE_COUNT_MAX_SCORE,
      status: 'warn',
      hint: `이미지 ${imageCount}장 → 최소 3장 이상 권장`,
      gainIfFixed: IMAGE_COUNT_MAX_SCORE - 4,
    };
  }

  return {
    name,
    score: 0,
    maxScore: IMAGE_COUNT_MAX_SCORE,
    status: 'error',
    hint: '이미지 0장 → 최소 3장 이상 권장',
    gainIfFixed: IMAGE_COUNT_MAX_SCORE,
  };
}

function checkImageSpacing(contentLength: number, imageCount: number): CheckResult {
  const name = '이미지 간격';

  if (imageCount === 0) {
    return {
      name,
      score: 0,
      maxScore: IMAGE_SPACING_MAX_SCORE,
      status: 'error',
      hint: '300~500자마다 이미지 1장 배치가 이상적이에요.',
      gainIfFixed: IMAGE_SPACING_MAX_SCORE,
    };
  }

  const avgSpacing = contentLength / imageCount;

  if (avgSpacing >= OPTIMAL_SPACING_MIN && avgSpacing <= OPTIMAL_SPACING_MAX) {
    return {
      name,
      score: IMAGE_SPACING_MAX_SCORE,
      maxScore: IMAGE_SPACING_MAX_SCORE,
      status: 'pass',
    };
  }

  if (avgSpacing >= ACCEPTABLE_SPACING_MIN && avgSpacing <= ACCEPTABLE_SPACING_MAX) {
    return {
      name,
      score: 5,
      maxScore: IMAGE_SPACING_MAX_SCORE,
      status: 'warn',
      hint: '300~500자마다 이미지 1장 배치가 이상적이에요.',
      gainIfFixed: IMAGE_SPACING_MAX_SCORE - 5,
    };
  }

  return {
    name,
    score: 2,
    maxScore: IMAGE_SPACING_MAX_SCORE,
    status: 'warn',
    hint: '300~500자마다 이미지 1장 배치가 이상적이에요.',
    gainIfFixed: IMAGE_SPACING_MAX_SCORE - 2,
  };
}

function checkVideoInclusion(videoCount: number): CheckResult {
  const name = '동영상 포함';

  if (videoCount >= 1) {
    return {
      name,
      score: VIDEO_MAX_SCORE,
      maxScore: VIDEO_MAX_SCORE,
      status: 'pass',
    };
  }

  return {
    name,
    score: 0,
    maxScore: VIDEO_MAX_SCORE,
    status: 'warn',
    hint: '동영상 1개 이상 포함하면 D.I.A. 가산점을 받아요.',
    gainIfFixed: VIDEO_MAX_SCORE,
  };
}

export function checkMedia({ content, imageCount, videoCount }: MediaInput): CheckResult[] {
  return [
    checkImageCount(imageCount),
    checkImageSpacing(content.length, imageCount),
    checkVideoInclusion(videoCount),
  ];
}
