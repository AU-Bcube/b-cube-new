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
    <footer className="relative z-40 border-t border-border/50 bg-surface/80 backdrop-blur-2xl">
      {/* Desktop */}
      <div className="hidden items-center justify-between px-6 py-8 md:flex lg:mx-auto lg:max-w-screen-xl">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="logo" width={28} height={28} />
            <Image src="/BCUBE.svg" alt="BCUBE" width={72} height={18} />
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm text-muted">
            아주대학교 경영대학 소학회
          </span>
        </div>
        <ul className="flex items-center gap-3">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.alt}>
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-light text-on-surface-dim transition-all duration-200 hover:border-on-surface-dim/30 hover:text-on-surface"
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
        <p className="text-2xl font-bold tracking-tight text-on-surface">B-CUBE</p>
        <div className="flex flex-col gap-1.5 text-sm">
          <p className="font-medium tracking-wide text-on-surface-dim">
            Broad Business Builder
          </p>
          <p className="text-muted">아주대학교 경영대학 소학회</p>
        </div>
        <div className="flex gap-3">
          {SOCIAL_LINKS.map((link) => (
            <Link
              key={link.alt}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-light text-on-surface-dim transition-all duration-200 hover:border-on-surface-dim/30 hover:text-on-surface"
            >
              <Image
                src={link.icon}
                alt={link.alt}
                width={20}
                height={20}
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
