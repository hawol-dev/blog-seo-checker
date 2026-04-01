import type { CheckResult } from '@/lib/seo/types';

export function groupChecks(checks: CheckResult[]) {
  const errors: CheckResult[] = [];
  const warns: CheckResult[] = [];
  const passes: CheckResult[] = [];

  for (const check of checks) {
    if (check.status === 'error') errors.push(check);
    else if (check.status === 'warn') warns.push(check);
    else passes.push(check);
  }

  return { errors, warns, passes };
}
