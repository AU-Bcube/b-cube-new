import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ChevronDown } from "lucide-react";
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

// 디자인톤 카드를 누르면 오는 상세 페이지. 선택 항목(기간, 링크)은 값이 없으면 그 줄을 그리지 않는다.
export default async function DesigntonDetailPage({ params }: Props) {
  const item = await findDesignton(params);
  if (!item) notFound();

  return (
    <main className="relative z-10 mx-auto flex max-w-3xl flex-col gap-5 break-keep px-6 py-10 md:py-16">
      <Link
        href="/projects"
        className="flex items-center gap-1.5 self-end rounded-full border border-white/10 bg-[#141d47] px-4 py-2 text-xs text-on-surface/90 transition-colors hover:border-primary-light/30"
      >
        <ArrowLeft size={12} />
        목록으로
      </Link>

      <section className="rounded-3xl border border-white/8 bg-linear-to-b from-[#17225a] to-[#131c4a] px-7 pb-8 pt-20 md:px-8 md:pt-24">
        <h1 className="text-3xl font-bold text-on-surface md:text-4xl">{item.title}</h1>
        <p className="mt-3 text-sm text-on-surface/70">{item.summary}</p>
      </section>

      <details open className="group rounded-2xl border border-white/8 bg-[#141d47]">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 [&::-webkit-details-marker]:hidden">
          <h2 className="text-base font-bold text-on-surface">프로젝트 요약</h2>
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-on-surface/70">
            <ChevronDown size={12} className="transition-transform group-open:rotate-180" />
          </span>
        </summary>
        <dl className="flex flex-col gap-4 border-t border-white/8 px-5 py-5 text-sm">
          {item.period && <Row label="기간">{item.period}</Row>}
          <Row label="형태">{item.type}</Row>
          <Row label="팀원">{item.members?.map((m) => m.name).join(", ")}</Row>
          {item.link && (
            <Row label="링크">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-xs text-primary-light transition-colors hover:border-primary-light/40"
              >
                링크
                <ArrowUpRight size={12} />
              </a>
            </Row>
          )}
        </dl>
      </details>

      <section className="mt-10 rounded-2xl border border-white/20 px-7 py-8 md:mt-14">
        <h2 className="text-xl font-bold text-on-surface md:text-2xl">프로젝트 설명</h2>
        <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-on-surface/80">
          {item.description}
        </p>
      </section>

      <DesigntonPdf id={item.id} pdfUrl={item.pdfPath} />
    </main>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[3.5rem_1fr] items-center gap-4">
      <dt className="text-xs text-on-surface/50">{label}</dt>
      <dd className="text-on-surface/90">{children}</dd>
    </div>
  );
}
