import type { ReactNode } from "react";
import type { Designton } from "@/types";

// 디자인톤 카드를 누르면 뜨는 모달에서 PDF 위에 보여 주는 정보 테이블.
// 선택 항목(기간, 링크, 팀원 역할)은 값이 없으면 그 줄을 그리지 않는다.
export default function DesigntonDetail({ item }: { item: Designton }) {
  const members = item.members ?? [];

  return (
    <div className="flex flex-col gap-6 text-on-surface">
      <section className="rounded-2xl bg-[#0a1c45] px-6 py-5 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
        <h3 className="text-xl font-bold md:text-2xl">{item.title}</h3>
        {item.summary && <p className="mt-2 text-sm">{item.summary}</p>}
      </section>

      <div className="grid items-start gap-6 md:grid-cols-2">
        <Panel title="프로젝트 요약">
          {item.period && <Row label="프로젝트 기간">{item.period}</Row>}
          {item.type && <Row label="프로젝트 형태">{item.type}</Row>}
          {item.link && (
            <Row label="프로젝트 링크">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block whitespace-nowrap rounded-xl bg-[#0d2557] px-10 py-2.5 text-sm shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:bg-[#123070]"
              >
                링크
              </a>
            </Row>
          )}
        </Panel>

        {members.length > 0 && (
          <Panel title="프로젝트 팀원">
            {members.map((m, i) => (
              <Row key={`${m.name}-${i}`} label={m.name}>
                {m.role}
              </Row>
            ))}
          </Panel>
        )}
      </div>

      {item.description && (
        <section className="rounded-2xl border border-white/70 px-6 py-5 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          <h4 className="text-lg font-bold md:text-xl">프로젝트 설명</h4>
          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed">
            {item.description}
          </p>
        </section>
      )}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details open className="group rounded-2xl bg-[#0a1c45] px-6 py-5 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      <summary className="flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
        <h4 className="text-lg font-bold md:text-xl">{title}</h4>
        <span aria-hidden className="text-sm transition-transform group-not-open:-rotate-90">
          ▼
        </span>
      </summary>
      <dl className="mt-4 flex flex-col gap-5">{children}</dl>
    </details>
  );
}

function Row({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <div className="grid grid-cols-[9rem_1fr] items-center gap-4 text-sm">
      <dt className="font-bold">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
