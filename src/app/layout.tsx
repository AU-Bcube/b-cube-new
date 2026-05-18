import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleTagManager } from '@next/third-parties/google';
import { SITE, absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: 'education',
  icons: { icon: SITE.logo },
  keywords: [...SITE.keywords],
  alternates: {
    canonical: SITE.url,
  },
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: '비큐브 B-CUBE 공식 웹사이트 대표 이미지',
      },
    ],
    url: SITE.url,
    siteName: SITE.name,
    locale: SITE.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  other: {
    'naver-site-verification': SITE.naverVerification,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${absoluteUrl('/')}#organization`,
      name: SITE.name,
      alternateName: ['B-CUBE', '비큐브', '아주대 비큐브'],
      url: SITE.url,
      logo: absoluteUrl(SITE.logo),
      description: SITE.description,
      sameAs: [...SITE.sameAs],
      parentOrganization: {
        '@type': 'CollegeOrUniversity',
        name: '아주대학교',
        url: 'https://www.ajou.ac.kr',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${absoluteUrl('/')}#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      publisher: { '@id': `${absoluteUrl('/')}#organization` },
      inLanguage: SITE.language,
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
        <GoogleTagManager gtmId="GTM-WVR9PN5Z" />
      </head>
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
