"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/sexyit_season2/",
    icon: "/insta_logo.svg",
    alt: "Instagram",
  },
  {
    href: "https://open.kakao.com/o/sCRuhWTg",
    icon: "/kakaoTalk_logo.svg",
    alt: "KakaoTalk",
  },
  {
    href: "https://github.com/AU-Bcube",
    icon: "/github_logo.svg",
    alt: "GitHub",
  },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative z-40 border-t border-white/[0.06] bg-surface/70 backdrop-blur-xl">
      {/* Desktop */}
      <div className="hidden items-center justify-between px-6 py-8 md:flex lg:mx-auto lg:max-w-screen-xl">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="logo" width={28} height={28} />
            <Image src="/BCUBE.svg" alt="BCUBE" width={72} height={18} />
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-sm text-muted">
            아주대학교 경영대학 소학회
          </span>
        </div>
        <ul className="flex items-center gap-4">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.alt}>
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] opacity-60 transition-all hover:border-white/10 hover:bg-white/[0.06] hover:opacity-100"
              >
                <Image
                  src={link.icon}
                  alt={link.alt}
                  width={18}
                  height={18}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile */}
      <div className="flex flex-col items-start gap-5 px-7 py-10 md:hidden">
        <p className="text-2xl font-bold text-white">B-CUBE</p>
        <div className="flex flex-col gap-1 text-sm">
          <p>
            <span className="font-medium text-primary-light">B</span>
            <span className="text-white/60">road </span>
            <span className="font-medium text-primary-light">B</span>
            <span className="text-white/60">usiness </span>
            <span className="font-medium text-primary-light">B</span>
            <span className="text-white/60">uilder</span>
          </p>
          <p className="text-white/40">아주대학교 경영대학 소학회</p>
        </div>
        <div className="flex gap-3">
          {SOCIAL_LINKS.map((link) => (
            <Link
              key={link.alt}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] opacity-60 transition-all hover:opacity-100"
            >
              <Image
                src={link.icon}
                alt={link.alt}
                width={22}
                height={22}
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
