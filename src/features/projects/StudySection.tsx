"use client";

import { useState } from "react";
import ProjectCard from "@/components/cards/ProjectCard";
import TabButton from "@/components/ui/TabButton";
import type { Study } from "@/types";

interface Props {
  data: Study[];
}

export default function StudySection({ data }: Props) {
  const [visiblePosts, setVisiblePosts] = useState(6);

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center overflow-hidden px-6 md:px-12">
      <div className="flex w-full flex-col items-start gap-10 md:gap-16">
        <section className="flex w-full flex-col gap-4 md:gap-6">
          <h2 className="text-xl font-semibold sm:text-5xl text-gradient">
            스터디
          </h2>
          <p className="text-sm text-on-surface/70 sm:text-lg">
            파이썬, JAVA 등 실제 업무에 사용되는 프로그래밍 언어를 배우고 활용해보는 정기 활동
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
