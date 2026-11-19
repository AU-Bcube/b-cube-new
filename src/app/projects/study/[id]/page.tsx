import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getStudies } from "@/actions/data";
import DetailHeader from "@/features/projects/DetailHeader";

type Props = { params: Promise<{ id: string }> };

// 한 줄 소개가 있는 스터디만 상세 페이지가 있다
async function findStudy(params: Props["params"]) {
  const { id } = await params;
  return (await getStudies()).find((s) => s.id === id && s.summary);
}

export async function generateStaticParams() {
  return (await getStudies()).filter((s) => s.summary).map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await findStudy(params);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: `/projects/study/${item.id}` },
  };
}

// 스터디 카드를 누르면 오는 상세 페이지. 머리 부분은 디자인톤 상세와 같고,
// 본문은 기획안 블록(할 수 있게 되는 것 카드, 커리큘럼 타임라인, 결과물 링크)이다. 값이 없는 블록은 그리지 않는다.
export default async function StudyDetailPage({ params }: Props) {
  const item = await findStudy(params);
  if (!item) notFound();

  return (
    <main className="mx-auto max-w-178 break-keep px-4 pb-16 pt-8 md:pb-20 md:pt-12">
      <DetailHeader
        eyebrow={`${item.year} STUDY`}
        title={item.title}
        summary={item.summary}
        meta={[
          ["기간", item.period],
          ["일정", item.schedule],
          ["난이도", item.level],
          ["스터디원", item.members?.join(", ")],
          ["툴", item.tools],
        ]}
      />

      {!!item.outcomes?.length && (
        <section className="mt-10 rounded-2xl border border-white/12 p-6 md:p-7">
          <h2 className="text-lg font-bold text-white md:text-xl">이런 걸 할 수 있게 돼요</h2>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-[#b8c1d9] md:text-base">
            {item.outcomes.map((text) => (
              <li key={text} className="flex items-baseline gap-3">
                <span className="size-1.5 shrink-0 -translate-y-0.5 rounded-full bg-[#6ec1ff] shadow-[0_0_0_3px_rgba(110,193,255,0.2)]" />
                {text}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!!item.curriculum?.length && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-white md:text-xl">커리큘럼</h2>
          <ol className="mt-5">
            {item.curriculum.map((text, i, all) => (
              <li key={text} className="relative pb-7 pl-7 text-sm text-[#b8c1d9] last:pb-0 md:text-base">
                <span className="absolute left-0 top-1.5 size-3 rounded-full border-2 border-[#6ec1ff]" />
                {i < all.length - 1 && (
                  <span className="absolute bottom-0 left-[5.5px] top-5 w-px bg-[#6ec1ff]/35" />
                )}
                {text}
              </li>
            ))}
          </ol>
        </section>
      )}

      {item.notionUrl && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-white md:text-xl">결과물 및 후기</h2>
          <a
            href={item.notionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-between rounded-xl border border-white/11 bg-[#141d45] px-5 py-4 text-sm font-semibold text-[#d9deec] transition-colors hover:border-primary-light/30"
          >
            노션에서 보기
            <ArrowUpRight size={16} />
          </a>
        </section>
      )}
    </main>
  );
}
