'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const FEATURE_TAGS = [
  { label: '15개 항목', emphasis: '15개', rest: ' 항목 분석' },
  { label: 'D.I.A. 기반', emphasis: 'D.I.A.', rest: ' 기반' },
  { label: '무료 3회/일', emphasis: '3회', rest: '/일 무료' },
] as const;

export function LoginCard() {
  const router = useRouter();
  const supabase = createClient();

  const handleNaverLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'naver' as 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    });
  };

  const handleKakaoLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao' as 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    });
  };

  const handleGuestAccess = () => {
    router.push('/');
  };

  return (
    <div className="relative z-10 w-[420px] bg-surface rounded-2xl px-10 py-12 border border-border">
      {/* Logo */}
      <h1 className="font-display font-extrabold text-[32px] tracking-tight text-center">
        Post<span className="text-accent">Kit</span>
      </h1>

      {/* Badge */}
      <p className="text-center text-xs text-text-muted mt-1.5">
        네이버 블로그 전용 SEO 분석기
      </p>

      {/* Feature tags */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {FEATURE_TAGS.map(({ label, emphasis, rest }) => (
          <span
            key={label}
            className="inline-flex items-center text-[11px] text-text-secondary bg-base border border-border rounded-full px-2.5 py-1"
          >
            <span className="text-accent font-semibold">{emphasis}</span>
            {rest}
          </span>
        ))}
      </div>

      {/* Description */}
      <div className="text-center mt-7">
        <p className="text-[15px] font-bold text-text-primary">
          로그인하고 분석 시작하기
        </p>
        <p className="text-[13px] text-text-muted mt-1">
          히스토리 저장, 점수 추이 확인이 가능해요
        </p>
      </div>

      {/* Social login buttons */}
      <div className="flex flex-col gap-3 mt-7">
        {/* Naver */}
        <button
          type="button"
          onClick={handleNaverLogin}
          className="flex items-center justify-center gap-2.5 w-full h-12 rounded-xl bg-[#03C75A] text-white font-semibold text-sm cursor-pointer transition-shadow hover:shadow-[0_0_20px_rgba(3,199,90,0.35)]"
        >
          <span className="font-extrabold text-base leading-none">N</span>
          네이버로 시작하기
        </button>

        {/* Kakao */}
        <button
          type="button"
          onClick={handleKakaoLogin}
          className="flex items-center justify-center gap-2.5 w-full h-12 rounded-xl bg-[#FEE500] text-[#191919] font-semibold text-sm cursor-pointer transition-shadow hover:shadow-[0_0_20px_rgba(254,229,0,0.35)]"
        >
          <span className="text-base leading-none">💬</span>
          카카오로 시작하기
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-muted">또는</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Guest button */}
      <button
        type="button"
        onClick={handleGuestAccess}
        className="flex items-center justify-center w-full h-12 rounded-xl bg-base border border-border text-text-secondary text-sm font-medium cursor-pointer transition-colors hover:border-accent hover:text-text-primary"
      >
        로그인 없이 바로 분석하기 (저장 불가)
      </button>

      {/* Footer */}
      <p className="text-center text-[11px] text-text-muted mt-6 leading-relaxed">
        로그인 시{' '}
        <a href="/terms" className="text-accent hover:underline">
          이용약관
        </a>
        {' 및 '}
        <a href="/privacy" className="text-accent hover:underline">
          개인정보처리방침
        </a>
        에 동의하게 됩니다.
      </p>
    </div>
  );
}
