# PostKit MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Naver Blog SEO analyzer — input title + keyword + content → 100-point score with 13 checklist items and improvement hints.

**Architecture:** Single Next.js 16 app with Server Actions for SEO analysis logic. Supabase handles DB (PostgreSQL) and Auth (Naver/Kakao OAuth via @supabase/ssr). No separate backend server. Deployed to Vercel only.

**Tech Stack:** Next.js 16, Tailwind CSS v4, shadcn/ui, Zustand, Supabase (DB + Auth), Vitest

**Spec:** `docs/superpowers/specs/2026-03-24-postkit-design.md`
**Mockups:** `.superpowers/brainstorm/1692-1774312850/` (`web-design-refined-v3.html`, `web-history-refined.html`, `web-login-refined.html`)

---

## File Structure

```
blog-seo-checker/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout: fonts, dark theme, metadata
│   │   ├── globals.css                 # Tailwind v4 @theme + custom CSS
│   │   ├── page.tsx                    # / → Analysis page
│   │   ├── history/
│   │   │   └── page.tsx                # /history → History page
│   │   ├── login/
│   │   │   └── page.tsx                # /login → Login page
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts            # OAuth callback handler
│   ├── actions/
│   │   ├── analyze.ts                  # Server Action: analyzePost()
│   │   ├── history.ts                  # Server Action: getHistory(), getAnalysis()
│   │   └── usage.ts                    # Server Action: getTodayUsage()
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # Browser client (createBrowserClient)
│   │   │   ├── server.ts              # Server client (createServerClient)
│   │   │   └── middleware.ts          # Supabase auth middleware helper
│   │   └── seo/
│   │       ├── analyzer.ts            # Orchestrator: runs all checkers
│   │       ├── checkers/
│   │       │   ├── keyword.ts         # 키워드 최적화 (25pts)
│   │       │   ├── structure.ts       # 콘텐츠 구조 (25pts)
│   │       │   ├── media.ts           # 미디어 활용 (20pts)
│   │       │   ├── links.ts           # 링크 & 태그 (15pts)
│   │       │   └── readability.ts     # 마무리 & 가독성 (15pts)
│   │       ├── grade.ts               # Score → Grade (S/A/B/C/D)
│   │       └── types.ts              # SEO analysis types
│   ├── components/
│   │   ├── layout/
│   │   │   └── header.tsx             # Shared header
│   │   ├── analyze/
│   │   │   ├── input-panel.tsx        # Left: inputs + meta + CTA
│   │   │   ├── result-panel.tsx       # Right: score + checklist
│   │   │   ├── score-ring.tsx         # Conic-gradient score circle
│   │   │   ├── check-item.tsx         # Single checklist row
│   │   │   └── meta-cards.tsx         # 5-column meta input cards
│   │   ├── history/
│   │   │   ├── history-list.tsx       # Left: scrollable list
│   │   │   └── history-detail.tsx     # Right: selected detail
│   │   └── login/
│   │       └── login-card.tsx         # Center: social login card
│   ├── stores/
│   │   └── analyze-store.ts           # Zustand: analysis form + result
│   └── types/
│       └── index.ts                   # Shared app types
├── tests/
│   ├── seo/
│   │   ├── keyword.test.ts
│   │   ├── structure.test.ts
│   │   ├── media.test.ts
│   │   ├── links.test.ts
│   │   ├── readability.test.ts
│   │   └── analyzer.test.ts
│   └── actions/
│       └── analyze.test.ts
├── supabase/
│   └── migrations/
│       └── 001_init.sql               # DB schema
├── middleware.ts                       # Next.js middleware (Supabase auth refresh)
├── next.config.ts
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── components.json                    # shadcn/ui config
└── .gitignore
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: entire project via `create-next-app` + shadcn init
- Create: `vitest.config.ts`, `.gitignore`
- Create: `src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`
- Create: `middleware.ts` (root)

- [ ] **Step 1: Initialize git**

```bash
cd C:/Users/swoom/Desktop/dev/blog-seo-checker
git init
```

- [ ] **Step 2: Create .gitignore**

```gitignore
node_modules/
.env
.env.local
.next/
.superpowers/
```

- [ ] **Step 3: Scaffold Next.js 16 project**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias
```

- [ ] **Step 4: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

Select: New York style, CSS variables, dark mode. This generates `components.json` and base styles.

- [ ] **Step 5: Add shadcn components we need**

```bash
npx shadcn@latest add button input textarea badge
```

- [ ] **Step 6: Install dependencies**

```bash
npm install zustand @supabase/supabase-js @supabase/ssr
npm install -D vitest @testing-library/react
```

- [ ] **Step 7: Configure vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

- [ ] **Step 8: Create Supabase client utilities**

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options));
        },
      },
    },
  );
}
```

- [ ] **Step 9: Create Next.js middleware for auth token refresh**

```typescript
// middleware.ts (project root)
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options));
        },
      },
    },
  );
  await supabase.auth.getUser();
  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

- [ ] **Step 10: Create SEO types**

```typescript
// src/lib/seo/types.ts
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

export interface CheckResult {
  name: string;
  score: number;
  maxScore: number;
  status: 'pass' | 'warn' | 'error';
  hint?: string;
  gainIfFixed?: number;
}

export interface AnalyzeResult {
  totalScore: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  gradeMessage: string;
  checks: CheckResult[];
}
```

- [ ] **Step 11: Create directory structure**

```bash
mkdir -p src/{actions,lib/seo/checkers,lib/supabase,components/{layout,analyze,history,login},stores,types}
mkdir -p tests/{seo,actions}
mkdir -p supabase/migrations
```

- [ ] **Step 12: Verify dev server starts**

```bash
npm run dev
```

Expected: localhost:3000 loads

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 16 + Tailwind v4 + shadcn/ui + Supabase project"
```

---

## Task 2: SEO Keyword Checker (25pts) — TDD

**Files:**
- Create: `src/lib/seo/checkers/keyword.ts`
- Test: `tests/seo/keyword.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// tests/seo/keyword.test.ts
import { describe, it, expect } from 'vitest';
import { checkKeyword } from '@/lib/seo/checkers/keyword';

describe('keyword checker', () => {
  const base = { title: '제주도 맛집 추천 BEST 7', keyword: '제주도 맛집 추천', content: '' };

  it('gives 10/10 when keyword starts the title', () => {
    const result = checkKeyword({ ...base, title: '제주도 맛집 추천 완벽 가이드' });
    const check = result.find(c => c.name === '제목 내 키워드');
    expect(check?.score).toBe(10);
  });

  it('gives 7/10 when keyword exists but not at start', () => {
    const result = checkKeyword({ ...base, title: '완벽 가이드 — 제주도 맛집 추천' });
    expect(result.find(c => c.name === '제목 내 키워드')?.score).toBe(7);
  });

  it('gives 0/10 when keyword is missing', () => {
    const result = checkKeyword({ ...base, title: '여행 가이드' });
    expect(result.find(c => c.name === '제목 내 키워드')?.score).toBe(0);
  });

  it('gives 8/8 for 1-3% keyword density', () => {
    const content = '제주도 맛집 추천 정보입니다. '.repeat(10) + '가'.repeat(200);
    const result = checkKeyword({ ...base, content });
    expect(result.find(c => c.name === '키워드 밀도')?.status).toBe('pass');
  });

  it('warns for density over 3%', () => {
    const content = '제주도 맛집 추천 '.repeat(50);
    const result = checkKeyword({ ...base, content });
    expect(result.find(c => c.name === '키워드 밀도')?.status).not.toBe('pass');
  });

  it('gives 7/7 when keyword in first 100 chars', () => {
    const content = '오늘은 제주도 맛집 추천을 해볼게요. ' + '내용 '.repeat(200);
    const result = checkKeyword({ ...base, content });
    expect(result.find(c => c.name === '첫 문단 키워드')?.score).toBe(7);
  });

  it('gives 0/7 when keyword absent from first 100 chars', () => {
    const content = '오늘은 여행 이야기를 해볼게요. '.repeat(5) + '제주도 맛집 추천';
    const result = checkKeyword({ ...base, content });
    expect(result.find(c => c.name === '첫 문단 키워드')?.score).toBe(0);
  });
});
```

- [ ] **Step 2: Run tests — verify fail**

```bash
npx vitest run tests/seo/keyword.test.ts
```

- [ ] **Step 3: Implement keyword checker**

`src/lib/seo/checkers/keyword.ts` — 3 checks: title keyword (10pts), density (8pts), first paragraph (7pts). Return `CheckResult[]`.

- [ ] **Step 4: Run tests — verify pass**
- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add keyword checker — title, density, first paragraph (25pts)"
```

---

## Task 3: SEO Structure Checker (25pts) — TDD

**Files:**
- Create: `src/lib/seo/checkers/structure.ts`
- Test: `tests/seo/structure.test.ts`

- [ ] **Step 1: Write failing tests**

Tests for: char count (10pts), subheading count (8pts), paragraph length (7pts)

- [ ] **Step 2: Run tests — verify fail**
- [ ] **Step 3: Implement structure checker**
- [ ] **Step 4: Run tests — verify pass**
- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add structure checker — char count, subheadings, paragraphs (25pts)"
```

---

## Task 4: SEO Media, Links, Readability Checkers (50pts) — TDD

**Files:**
- Create: `src/lib/seo/checkers/media.ts`, `links.ts`, `readability.ts`
- Test: `tests/seo/media.test.ts`, `links.test.ts`, `readability.test.ts`

- [ ] **Step 1: Write failing tests for all three**

**media**: imageCount, imageSpacing, videoCount
**links**: externalLinks (0=만점!), internalLinks, tags
**readability**: conclusion, titleLength, emoji density

- [ ] **Step 2: Run tests — verify fail**
- [ ] **Step 3: Implement media checker** (20pts)
- [ ] **Step 4: Implement links checker** (15pts)
- [ ] **Step 5: Implement readability checker** (15pts)
- [ ] **Step 6: Run all tests — verify pass**

```bash
npx vitest run
```

- [ ] **Step 7: Commit**

```bash
git commit -m "feat: add media, links, readability checkers (50pts total)"
```

---

## Task 5: SEO Analyzer Orchestrator + Grade

**Files:**
- Create: `src/lib/seo/analyzer.ts`, `src/lib/seo/grade.ts`
- Test: `tests/seo/analyzer.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { analyze } from '@/lib/seo/analyzer';

describe('analyzer', () => {
  it('returns 13 checks with total score and grade', () => {
    const result = analyze({
      title: '제주도 맛집 추천 BEST 7',
      keyword: '제주도 맛집 추천',
      content: '제주도 맛집 추천 여행 가이드.\n\n## 흑돼지\n내용\n\n## 해산물\n내용\n\n맺음말.',
      imageCount: 5, videoCount: 1, tagCount: 8,
      externalLinkCount: 0, internalLinkCount: 2,
    });
    expect(result.checks).toHaveLength(13);
    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.totalScore).toBeLessThanOrEqual(100);
    expect(['S','A','B','C','D']).toContain(result.grade);
  });
});
```

- [ ] **Step 2: Run — verify fail**
- [ ] **Step 3: Implement grade.ts + analyzer.ts**
- [ ] **Step 4: Run — verify pass**
- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add analyzer orchestrator + grade system (S/A/B/C/D)"
```

---

## Task 6: Server Action — analyzePost()

**Files:**
- Create: `src/actions/analyze.ts`
- Test: `tests/actions/analyze.test.ts`

- [ ] **Step 1: Write failing test**
- [ ] **Step 2: Implement Server Action**

```typescript
// src/actions/analyze.ts
'use server';

import { analyze } from '@/lib/seo/analyzer';
import type { AnalyzeInput, AnalyzeResult } from '@/lib/seo/types';

export async function analyzePost(input: AnalyzeInput): Promise<AnalyzeResult> {
  // Validate
  if (!input.title || !input.keyword || !input.content) {
    throw new Error('제목, 키워드, 본문은 필수입니다.');
  }
  return analyze(input);
}
```

- [ ] **Step 3: Run tests — verify pass**
- [ ] **Step 4: Commit**

```bash
git commit -m "feat: add analyzePost server action"
```

---

## Task 7: Frontend — Design System + Layout

**Files:**
- Modify: `src/app/globals.css`, `src/app/layout.tsx`
- Create: `src/components/layout/header.tsx`

- [ ] **Step 1: Configure Tailwind v4 @theme in globals.css**

```css
@import "tailwindcss";

@theme {
  --color-base: #08080c;
  --color-surface: #0e0e14;
  --color-elevated: #14141c;
  --color-border: #1e1e2a;
  --color-border-subtle: #16161f;
  --color-text-primary: #e8e8ef;
  --color-text-secondary: #8888a0;
  --color-text-muted: #555566;
  --color-accent: #9b7cfa;
  --color-accent-dim: #7c5ce0;
  --color-green: #34d399;
  --color-yellow: #fbbf24;
  --color-red: #f87171;
  --font-display: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Noto Sans KR', sans-serif;
}
```

- [ ] **Step 2: Set up root layout with fonts**

```tsx
import { Plus_Jakarta_Sans, Noto_Sans_KR } from 'next/font/google';
```

100vh fixed, max-w-[1400px] centered, dark theme.

- [ ] **Step 3: Build Header component**

Logo + center tabs (using `usePathname`) + usage badge + avatar. shadcn Button for tabs.

- [ ] **Step 4: Verify in browser**
- [ ] **Step 5: Commit**

```bash
git commit -m "feat: set up Tailwind v4 design system, root layout, Header"
```

---

## Task 8: Frontend — Analysis Input Panel

**Files:**
- Create: `src/components/analyze/input-panel.tsx`, `meta-cards.tsx`
- Create: `src/stores/analyze-store.ts`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create Zustand store**

Form state (title, keyword, content, meta counts) + result + isLoading + analyze action.

- [ ] **Step 2: Build MetaCards** — 5-column grid with +/- steppers using shadcn Button
- [ ] **Step 3: Build InputPanel** — shadcn Input for title/keyword, Textarea for content (flex-1, only scroll), MetaCards, CTA Button
- [ ] **Step 4: Wire page.tsx** — Header + split layout (44% input / 56% result placeholder)
- [ ] **Step 5: Verify in browser**
- [ ] **Step 6: Commit**

```bash
git commit -m "feat: add analysis input panel with Zustand store"
```

---

## Task 9: Frontend — Analysis Result Panel

**Files:**
- Create: `src/components/analyze/result-panel.tsx`, `score-ring.tsx`, `check-item.tsx`
- Modify: `src/stores/analyze-store.ts` (connect Server Action)
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build ScoreRing** — conic-gradient progress, score number, grade label
- [ ] **Step 2: Build CheckItem** — 3 variants (error/warn/pass), icon, name, score, hint, gain badge
- [ ] **Step 3: Build ResultPanel** — score header + checklist (error→warn→pass), overflow-y-auto
- [ ] **Step 4: Connect store to analyzePost Server Action**
- [ ] **Step 5: E2E test** — enter text → click analyze → see results
- [ ] **Step 6: Commit**

```bash
git commit -m "feat: add result panel with score ring, checklist, server action integration"
```

---

## Task 10: Supabase DB Schema + History

**Files:**
- Create: `supabase/migrations/001_init.sql`
- Create: `src/actions/history.ts`, `src/actions/usage.ts`
- Modify: `src/actions/analyze.ts` (save result to DB)

- [ ] **Step 1: Write DB migration**

```sql
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title VARCHAR(500) NOT NULL,
  keyword VARCHAR(200) NOT NULL,
  content_length INT NOT NULL,
  total_score INT NOT NULL,
  grade VARCHAR(1) NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analyses_user ON analyses(user_id, created_at DESC);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
```

- [ ] **Step 2: Run migration in Supabase dashboard**
- [ ] **Step 3: Implement getHistory() and getAnalysis() Server Actions**
- [ ] **Step 4: Implement getTodayUsage() Server Action**
- [ ] **Step 5: Modify analyzePost() to save result if user is logged in**
- [ ] **Step 6: Commit**

```bash
git commit -m "feat: add DB schema with RLS, history and usage server actions"
```

---

## Task 11: Supabase Auth (Naver/Kakao OAuth)

**Files:**
- Create: `src/app/auth/callback/route.ts`
- Modify: `src/components/login/login-card.tsx`

- [ ] **Step 1: Configure Supabase Auth providers**

In Supabase Dashboard → Authentication → Providers → Enable Naver + Kakao with client IDs/secrets.

- [ ] **Step 2: Create OAuth callback route**

```typescript
// src/app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
```

- [ ] **Step 3: Build login functions**

```typescript
// In login-card.tsx
const handleNaverLogin = async () => {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: 'naver' as any,
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
};
```

- [ ] **Step 4: Test OAuth flow end-to-end**
- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add Supabase Auth with Naver/Kakao OAuth"
```

---

## Task 12: Frontend — Login Page

**Files:**
- Create: `src/app/login/page.tsx`, `src/components/login/login-card.tsx`

- [ ] **Step 1: Build LoginCard** — logo, badge, feature tags, Naver button (#03C75A), Kakao button (#FEE500), divider, guest button, footer
- [ ] **Step 2: Wire login page** — full-screen centered, ambient glow background
- [ ] **Step 3: Add guest mode** — "로그인 없이 분석하기" redirects to / without auth
- [ ] **Step 4: Verify in browser**
- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add login page with Naver/Kakao social login + guest mode"
```

---

## Task 13: Frontend — History Page

**Files:**
- Create: `src/app/history/page.tsx`
- Create: `src/components/history/history-list.tsx`, `history-detail.tsx`

- [ ] **Step 1: Build HistoryList** — search, filter tabs, scrollable list with score/title/date/grade
- [ ] **Step 2: Build HistoryDetail** — title, score ring, full checklist, "다시 분석하기" button
- [ ] **Step 3: Wire history page with Server Actions**
- [ ] **Step 4: Add auth guard** — redirect to /login if not logged in
- [ ] **Step 5: Verify in browser**
- [ ] **Step 6: Commit**

```bash
git commit -m "feat: add history page with list, detail, auth guard"
```

---

## Task 14: Polish + Deploy

**Files:**
- Various (loading, error, empty states)
- Create: `.env.local.example`

- [ ] **Step 1: Add loading state** — CTA button spinner during analysis
- [ ] **Step 2: Add empty states** — pre-analysis placeholder, empty history
- [ ] **Step 3: Add error handling** — toast on failure
- [ ] **Step 4: Create .env.local.example**

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 5: Full E2E test**

1. /login → guest mode → / → enter blog post → analyze → see score
2. /login → Naver login → analyze → /history → see saved result

- [ ] **Step 6: Deploy to Vercel**

```bash
npx vercel
```

- [ ] **Step 7: Commit**

```bash
git commit -m "feat: add polish (loading, empty, error states) + deploy config"
```

---

## Task Dependencies

```
Task 1 (Scaffolding)
  ├── Tasks 2-4 (SEO Checkers) ─── 병렬 가능
  │     └── Task 5 (Orchestrator)
  │           └── Task 6 (Server Action)
  │                 └── Task 9 (FE Result Panel)
  ├── Task 7 (FE Design System)
  │     ├── Task 8 (FE Input Panel)
  │     ├── Task 12 (FE Login)
  │     └── Task 13 (FE History)
  ├── Task 10 (DB + History Actions)
  └── Task 11 (Auth)
        └── Task 14 (Polish + Deploy)
```

**병렬 가능**: Tasks 2-4 (체커들), Task 7-8 (FE 셋업)은 백엔드 작업과 동시 진행 가능.
