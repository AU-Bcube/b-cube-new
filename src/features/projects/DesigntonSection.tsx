"use client";

import { useState } from "react";
import { AppWindow, BriefcaseBusiness } from "lucide-react";
import DetailCard from "@/components/cards/DetailCard";
import TabButton from "@/components/ui/TabButton";
import type { Designton } from "@/types";

interface Props {
  data: Designton[];
}

const INFO = [
  {
    icon: BriefcaseBusiness,
    label: "할 수 있는 경험",
    text: "서비스 기획, 디자인, 리서치, 개발",
  },
  {
    icon: AppWindow,
    label: "진행 방식",
    text: "문제 발견 > 리서치 > 목표 및 기능 설계 > 기획 문서 작성 > 프로토타입 구현",
  },
];

export default function DesigntonSection({ data }: Props) {
  const [visiblePosts, setVisiblePosts] = useState(4);

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center overflow-hidden px-6 md:px-12">
      <div className="flex w-full flex-col items-start gap-10 md:gap-16">
        <section className="flex w-full flex-col gap-4 md:gap-6">
          <h2 className="text-xl font-semibold sm:text-5xl text-gradient">
            디자인톤
          </h2>
          <p className="text-sm text-on-surface/70 sm:text-lg">
            팀 별로 아이디어를 기획하고 구체화하여 앱 서비스를 기획하는 활동
          </p>
          <div className="grid w-full gap-4 md:grid-cols-2 md:gap-6">
            {INFO.map(({ icon: Icon, label, text }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/8 bg-[#151f4b] p-5 md:p-6"
              >
                <div className="flex items-center gap-3 text-sm text-on-surface/70">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-light/15 text-primary-light">
                    <Icon size={14} />
                  </span>
                  {label}
                </div>
                <p className="mt-4 break-keep text-sm font-bold leading-relaxed text-on-surface">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid w-full auto-rows-fr gap-4 md:grid-cols-2 md:gap-6">
          {data.slice(0, visiblePosts).map((item) => (
            <DetailCard
              key={item.id}
              href={`/projects/designton/${item.id}`}
              image={item.imagePath}
              year={item.year}
              title={item.title}
              summary={item.summary}
              award={item.award}
            />
          ))}
        </section>

        <div className="mb-10 flex w-full items-center justify-center md:mb-16">
          {visiblePosts < data.length && (
            <TabButton
              label="더보기"
              selected
              onClick={() => setVisiblePosts((v) => v + 4)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
