import { Grade } from '@/lib/seo/types';

interface GradeResult {
  grade: Grade;
  message: string;
}

const S_THRESHOLD = 90;
const A_THRESHOLD = 75;
const B_THRESHOLD = 60;
const C_THRESHOLD = 40;

export function getGrade(score: number): GradeResult {
  if (score >= S_THRESHOLD) {
    return { grade: 'S', message: '상위노출 준비 완료!' };
  }

  if (score >= A_THRESHOLD) {
    return { grade: 'A', message: '거의 다 왔어요! 소소한 개선만 하면 돼요.' };
  }

  if (score >= B_THRESHOLD) {
    return { grade: 'B', message: '조금만 더 개선하면 상위노출 가능해요.' };
  }

  if (score >= C_THRESHOLD) {
    return { grade: 'C', message: '개선이 필요한 부분이 있어요.' };
  }

  return { grade: 'D', message: '기본적인 SEO 요소를 보강해주세요.' };
}
