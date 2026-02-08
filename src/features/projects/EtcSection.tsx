"use client";

import { useState } from "react";
import ProjectCard from "@/components/cards/ProjectCard";
import TabButton from "@/components/ui/TabButton";
import type { Etc } from "@/types";

interface Props {
  data: Etc[];
}

export default function EtcSection({ data }: Props) {
  const [visiblePosts, setVisiblePosts] = useState(6);

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-center overflow-hidden px-8 md:px-12">
      <div className="flex w-full max-w-screen-lg flex-col items-start justify-start gap-10 md:gap-20">
        <section className="flex w-full flex-col gap-2 md:gap-4">
          <h2 className="text-xl font-bold tracking-tight text-on-surface sm:text-4xl">
            기타활동
          </h2>
          <p className="text-sm text-muted sm:text-lg">
            아이디어톤 등과 같이 매년 진행되는 프로젝트 외의 활동
          </p>
        </section>

        <section className="flex w-full flex-col">
          <div className="grid w-full auto-rows-fr gap-6 md:grid-cols-2 md:gap-12">
            {data.slice(0, visiblePosts).map((item) => (
              <ProjectCard
                key={item.id}
                image={item.imagePath}
                year={item.year}
                title={item.title}
                participants={item.participant}
                pdfUrl={item.pdfPath}
                award={item.award}
              />
            ))}
          </div>
        </section>

        <div className="mb-10 flex w-full items-center justify-center md:mb-20">
          {visiblePosts < data.length && (
            <TabButton
              label="더보기"
              selected
              onClick={() => setVisiblePosts((v) => v + 6)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
