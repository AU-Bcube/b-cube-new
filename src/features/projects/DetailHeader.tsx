import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface DetailHeaderProps {
  eyebrow: string;
  title: string;
  summary?: string;
  // [이름표, 값]. 값이 비어 있는 줄은 그리지 않는다
  meta: [string, ReactNode][];
}

// 디자인톤 · 스터디 상세 페이지 맨 위: 목록 링크, 구분 글씨, 제목, 한 줄 설명, 정보 줄
export default function DetailHeader({ eyebrow, title, summary, meta }: DetailHeaderProps) {
  const rows = meta.filter(([, value]) => value);

  return (
    <>
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#aeb8d4] transition-colors hover:text-white"
      >
        <ArrowLeft size={16} />
        프로젝트 목록
      </Link>

      <p className="mt-8 text-xs font-bold tracking-[0.12em] text-[#6ec1ff]">{eyebrow}</p>
      <h1 className="mt-1 text-3xl font-bold text-white md:text-4xl">{title}</h1>
      {summary && <p className="mt-2 text-sm text-[#b8c1d9] md:text-base">{summary}</p>}

      {rows.length > 0 && (
        <dl className="mt-6 flex flex-col gap-2 border-y border-white/10 py-4 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[3.5rem_1fr] gap-4">
              <dt className="text-xs font-semibold leading-5 text-[#6f7c9f]">{label}</dt>
              <dd className="text-[#d9deec]">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </>
  );
}
