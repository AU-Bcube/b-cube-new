import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface DetailCardProps {
  // 없으면 상세 페이지가 없는 카드로, 눌러도 이동하지 않는다
  href?: string;
  image: string;
  year: string;
  title: string;
  summary?: string;
  award?: string;
}

const CARD =
  "group overflow-hidden rounded-2xl border border-white/8 bg-[#141d47] transition-colors";

// 디자인톤 · 스터디 목록 카드: 16:9 표지, 연도, 제목, 한 줄 설명
export default function DetailCard({ href, image, year, title, summary, award }: DetailCardProps) {
  const body: ReactNode = (
    <>
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 768px) 452px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {award && (
          <span className="absolute right-3 top-3 rounded-full border border-amber-400/30 bg-amber-500/90 px-3 py-1 text-xs font-bold text-black">
            {award}
          </span>
        )}
        {href && (
          <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#4b4f5e]/90 text-white">
            <ArrowUpRight size={14} />
          </span>
        )}
      </div>
      <div className="p-5">
        <span className="text-xs font-bold text-primary-light">{year}</span>
        <h3 className="mt-1 truncate text-lg font-bold text-on-surface">{title}</h3>
        {summary && (
          <p className="mt-2 line-clamp-2 break-keep text-sm text-on-surface/70">{summary}</p>
        )}
      </div>
    </>
  );

  return href ? (
    <Link href={href} data-no-grid className={`${CARD} hover:border-primary-light/30`}>
      {body}
    </Link>
  ) : (
    <div data-no-grid className={CARD}>
      {body}
    </div>
  );
}
