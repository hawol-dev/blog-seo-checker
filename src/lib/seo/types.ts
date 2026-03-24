export interface AnalyzeInput {
  title: string;
  keyword: string;
  content: string;
  imageCount: number;
  videoCount: number;
  tagCount: number;
  externalLinkCount: number;
  internalLinkCount: number;
}

export type CheckStatus = 'pass' | 'warn' | 'error';

export interface CheckResult {
  name: string;
  score: number;
  maxScore: number;
  status: CheckStatus;
  hint?: string;
  gainIfFixed?: number;
}

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D';

export interface AnalyzeResult {
  totalScore: number;
  grade: Grade;
  gradeMessage: string;
  checks: CheckResult[];
}
