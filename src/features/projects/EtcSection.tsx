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
    <div className="mx-auto flex max-w-5xl flex-col items-center overflow-hidden px-6 md:px-12">
      <div className="flex w-full flex-col items-start gap-10 md:gap-16">
        <section className="flex w-full flex-col gap-4 md:gap-6">
          <h2 className="text-xl font-semibold sm:text-5xl text-gradient">
            기타활동
          </h2>
          <p className="text-sm text-on-surface/70 sm:text-lg">
            아이디어톤 등과 같이 매년 진행되는 프로젝트 외의 활동
          </p>
        </section>

        <section className="flex w-full flex-col">
          <div className="grid w-full auto-rows-fr gap-4 md:grid-cols-2 md:gap-6">
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

        <div className="mb-10 flex w-full items-center justify-center md:mb-16">
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
