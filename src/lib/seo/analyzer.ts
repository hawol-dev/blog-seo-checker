import { AnalyzeInput, AnalyzeResult, CheckResult, CheckStatus } from '@/lib/seo/types';
import { checkKeyword } from '@/lib/seo/checkers/keyword';
import { checkStructure } from '@/lib/seo/checkers/structure';
import { checkMedia } from '@/lib/seo/checkers/media';
import { checkLinks } from '@/lib/seo/checkers/links';
import { checkReadability } from '@/lib/seo/checkers/readability';
import { getGrade } from '@/lib/seo/grade';

const STATUS_ORDER: Record<CheckStatus, number> = {
  error: 0,
  warn: 1,
  pass: 2,
};

function sortChecksByStatus(checks: CheckResult[]): CheckResult[] {
  return [...checks].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
}

export function analyze(input: AnalyzeInput): AnalyzeResult {
  const { title, keyword, content, imageCount, videoCount, tagCount, externalLinkCount, internalLinkCount } = input;

  const allChecks: CheckResult[] = [
    ...checkKeyword({ title, keyword, content }),
    ...checkStructure({ content }),
    ...checkMedia({ content, imageCount, videoCount }),
    ...checkLinks({ externalLinkCount, internalLinkCount, tagCount }),
    ...checkReadability({ title, content }),
  ];

  const totalScore = allChecks.reduce((sum, check) => sum + check.score, 0);
  const { grade, message } = getGrade(totalScore);

  return {
    totalScore,
    grade,
    gradeMessage: message,
    checks: sortChecksByStatus(allChecks),
  };
}
