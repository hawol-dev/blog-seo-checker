import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Noto_Sans_KR } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PostKit — 네이버 블로그 SEO 분석기',
  description: '네이버 블로그 글의 SEO 점수를 분석하고 상위노출 가이드를 제공합니다.',
  openGraph: {
    title: 'PostKit — 네이버 블로그 SEO 분석기',
    description: '네이버 블로그 글의 SEO 점수를 분석하고 상위노출 가이드를 제공합니다.',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${jakarta.variable} ${notoSans.variable}`}>
      <body className="bg-base text-text-primary font-body antialiased min-h-screen md:h-screen md:overflow-hidden">
        <div className="min-h-screen md:h-full flex flex-col max-w-[1400px] mx-auto border-x border-border-subtle">
          {children}
        </div>
      </body>
    </html>
  );
}
