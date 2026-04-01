import type { Metadata } from 'next';
import { LoginCard } from '@/components/login/login-card';

export const metadata: Metadata = {
  title: '로그인 — PostKit',
  description: '네이버 또는 카카오 계정으로 PostKit에 로그인하세요.',
};

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center relative">
      {/* Ambient glow backgrounds */}
      <div className="absolute top-1/5 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(155,124,250,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-1/10 left-[30%] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(52,211,153,0.04)_0%,transparent_60%)] pointer-events-none" />
      <LoginCard />
    </div>
  );
}
