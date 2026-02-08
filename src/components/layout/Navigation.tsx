"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "홈" },
  { href: "/projects", label: "프로젝트" },
  { href: "/reviews", label: "후기" },
  { href: "/recruit", label: "리크루팅" },
];

interface NavigationProps {
  isRecruiting: boolean;
  recruitLink: string;
}

export default function Navigation({ isRecruiting, recruitLink }: NavigationProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/4 bg-surface/70 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4 lg:mx-auto lg:max-w-screen-xl">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="logo" width={28} height={28} />
            <Image src="/BCUBE.svg" alt="BCUBE" width={72} height={18} />
          </Link>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`rounded-full px-5 py-2 text-sm font-bold transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-white/10 text-white"
                        : "text-muted hover:bg-white/4 hover:text-on-surface-dim"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {isRecruiting && recruitLink && (
                <li>
                  <Link
                    href={recruitLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 rounded-full bg-primary-light px-5 py-2 text-sm font-bold text-surface transition-all duration-200 hover:bg-primary-light/85"
                  >
                    지원하기
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 md:hidden"
            aria-label="메뉴 열기"
          >
            <Image src="/hamburger.svg" alt="menu" width={24} height={24} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full bg-surface md:hidden"
            >
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <Image src="/logo.svg" alt="logo" width={28} height={28} />
                  <Image src="/BCUBE.svg" alt="BCUBE" width={72} height={18} />
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1"
                  aria-label="메뉴 닫기"
                >
                  <Image
                    src="/mobileCancel.svg"
                    alt="close"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
              <nav className="flex flex-col gap-6 px-8 py-12">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={`block rounded-xl px-4 py-3 text-2xl font-bold transition-colors ${
                        isActive(item.href)
                          ? "bg-primary-light/10 text-primary-light"
                          : "text-white/70 hover:bg-white/4 hover:text-white"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile floating "지원하기" button */}
      {isRecruiting && recruitLink && (
        <Link
          href={recruitLink}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-primary-light px-8 py-3 text-sm font-bold text-surface shadow-lg shadow-primary-light/25 transition-all duration-200 hover:bg-primary-light/85 md:hidden"
        >
          지원하기
        </Link>
      )}
    </>
  );
}
