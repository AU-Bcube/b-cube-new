import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: {
    default: '비큐브 B-cube',
    template: '%s | 비큐브 B-cube',
  },
  description: '아주대학교 경영인텔리전스학과 소학회',
  icons: { icon: '/logo.svg' },
  keywords: [
    'B-cube',
    'bcube',
    '비큐브',
    '동아리',
    'IT동아리',
    '아주대학교',
    '경영인텔리전스학과',
    '소학회',
    '이비즈',
    'e-비즈니스학과',
    'e-business',
    'IT기획',
    '웹개발',
    '앱개발',
    '백엔드',
    '프론트엔드',
    '피그마',
  ],
  metadataBase: new URL('https://www.b-cube.kr'),
  openGraph: {
    title: '비큐브 B-cube',
    description: '아주대학교 경영인텔리전스학과 소학회',
    images: '/opengraph-image.png',
    url: '/',
    siteName: '비큐브 B-cube',
    locale: 'ko_KR',
    type: 'website',
  },
  other: {
    'naver-site-verification': 'faeee0c5c10843f8a1f21c3ef305b36b5c7ac22b',
  },
  alternates: {
    canonical: '/',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.b-cube.kr/#organization',
      name: 'B-CUBE 비큐브',
      url: 'https://www.b-cube.kr',
      logo: 'https://www.b-cube.kr/logo.svg',
      description:
        '아주대학교 경영인텔리전스학과 IT 소학회. 웹/앱 서비스 기획 및 개발, 디자인톤, IT 스터디 등 다양한 활동을 진행합니다.',
      sameAs: ['https://www.instagram.com/ajou_bcube/'],
      foundingDate: '2017',
      parentOrganization: {
        '@type': 'CollegeOrUniversity',
        name: '아주대학교',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.b-cube.kr/#website',
      url: 'https://www.b-cube.kr',
      name: '비큐브 B-CUBE',
      publisher: { '@id': 'https://www.b-cube.kr/#organization' },
      inLanguage: 'ko',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          defer
          src="https://external.searchos.io/meta-loader/v1-dev.js"
          data-id="698c258ed125feae13f0260e"
          data-endpoint="https://api.searchos.kr/meta"></script>
      </head>
      <GoogleAnalytics gaId="G-16CC2DB93Q" />
      <body>
        {/* Gradient mesh background */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, #050e20 0%, #06132D 50%, #0a1a3a 100%)',
            }}
          />
          <div className="absolute -right-32 -top-32 h-150 w-150 animate-float rounded-full bg-primary/15 blur-[150px]" />
          <div className="absolute -left-32 top-1/2 h-125 w-125 animate-float-slow rounded-full bg-primary-light/10 blur-[120px]" />
        </div>
        <Navigation />
        {children}
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
