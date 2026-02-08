import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "비큐브 B-cube",
  description: "아주대학교 경영인텔리전스학과 소학회",
  icons: { icon: "/logo.svg" },
  keywords: [
    "B-cube",
    "bcube",
    "비큐브",
    "동아리",
    "IT동아리",
    "아주대학교",
    "경영인텔리전스학과",
    "소학회",
    "이비즈",
    "e-비즈니스학과",
    "e-business",
    "IT기획",
    "웹개발",
    "앱개발",
    "백엔드",
    "프론트엔드",
    "피그마",
  ],
  metadataBase: new URL("https://b-cube.kr"),
  openGraph: {
    title: "비큐브 B-cube",
    description: "아주대학교 경영인텔리전스학과 소학회",
    images: "/opengraph-image.png",
    url: "https://b-cube.kr",
    siteName: "비큐브 B-cube",
    locale: "ko_KR",
    type: "website",
  },
  other: {
    "naver-site-verification": "faeee0c5c10843f8a1f21c3ef305b36b5c7ac22b",
  },
  alternates: {
    canonical: "https://b-cube.kr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {/* Background */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-surface" />
          <div className="absolute -right-40 -top-40 h-[700px] w-[700px] animate-float rounded-full bg-primary/[0.07] blur-[200px]" />
          <div className="absolute -left-40 top-1/2 h-[600px] w-[600px] animate-float-slow rounded-full bg-accent/[0.05] blur-[180px]" />
        </div>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
