import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { getDesigntons } from "@/actions/data";
import DesigntonPdf from "@/features/projects/DesigntonPdf";

type Props = { params: Promise<{ id: string }> };

async function findDesignton(params: Props["params"]) {
  const { id } = await params;
  return (await getDesigntons()).find((d) => d.id === id);
}

export async function generateStaticParams() {
  return (await getDesigntons()).map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await findDesignton(params);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: `/projects/designton/${item.id}` },
  };
}

// 디자인톤 카드를 누르면 오는 상세 페이지. PC도 모바일처럼 한 줄(최대 680px)로 보여 준다.
// 선택 항목(기간)은 값이 없으면 그 줄을 그리지 않는다.
export default async function DesigntonDetailPage({ params }: Props) {
  const item = await findDesignton(params);
  if (!item) notFound();

  return (
    <main className="mx-auto max-w-178 break-keep px-4 pb-6 pt-8 md:pt-12">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#aeb8d4] transition-colors hover:text-white"
      >
        <ArrowLeft size={16} />
        프로젝트 목록
      </Link>

      <p className="mt-8 text-xs font-bold tracking-[0.12em] text-[#6ec1ff]">
        {item.year} DESIGNTHON
      </p>
      <h1 className="mt-1 text-3xl font-bold text-white md:text-4xl">{item.title}</h1>
      <p className="mt-2 text-sm text-[#b8c1d9] md:text-base">{item.summary}</p>

      <dl className="mt-6 flex flex-col gap-2 border-y border-white/10 py-4 text-sm">
        <Row label="참여자">{item.members?.map((m) => m.name).join(", ")}</Row>
        {item.period && <Row label="기간">{item.period}</Row>}
      </dl>

      <div className="mt-6 rounded-2xl border border-white/12 bg-[#141d45] p-2 shadow-[0_14px_36px_rgba(2,5,18,0.24)]">
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <Image
            src={item.imagePath}
            alt={`${item.title} PDF 표지`}
            fill
            sizes="(min-width: 712px) 664px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <details open className="group mt-6 rounded-2xl border border-white/11 bg-[#141d45] shadow-[0_12px_32px_rgba(2,5,18,0.18)]">
        <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 [&::-webkit-details-marker]:hidden">
          <h2 className="text-lg font-bold text-white md:text-xl">프로젝트 요약</h2>
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/11 text-[#b8c1d9]">
            <ChevronDown size={12} className="transition-transform group-open:rotate-180" />
          </span>
        </summary>
        <p className="whitespace-pre-line border-t border-white/10 px-6 py-5 text-sm leading-relaxed text-[#b8c1d9] md:text-base">
          {item.description}
        </p>
      </details>

      <DesigntonPdf id={item.id} title={item.title} pdfUrl={item.pdfPath} />
    </main>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[3.5rem_1fr] gap-4">
      <dt className="text-xs font-semibold leading-5 text-[#6f7c9f]">{label}</dt>
      <dd className="text-[#d9deec]">{children}</dd>
    </div>
  );
}
