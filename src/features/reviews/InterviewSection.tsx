"use client";

import { useState, Fragment } from "react";
import ProfileCard from "@/components/cards/ProfileCard";
import TabButton from "@/components/ui/TabButton";
import type { Interview } from "@/types";

interface Props {
  data: Interview[];
}

export default function InterviewSection({ data }: Props) {
  const [visibleCount, setVisibleCount] = useState(6);

  const visible = data.slice(0, visibleCount);

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-10 px-8 mt-16 md:gap-20 md:px-12">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {visible.map((post, index, arr) => {
          const isLastSingle = arr.length % 3 === 1 && index === arr.length - 1;
          return (
            <Fragment key={post.id}>
              {isLastSingle && <div className="hidden md:block md:col-span-1" />}
              <div className="flex justify-center">
                <ProfileCard
                  name={post.name}
                  studentId={post.studentId}
                  introduction={post.introduction}
                  imagePath={post.imagePath}
                />
              </div>
            </Fragment>
          );
        })}
      </div>

      <section className="mb-10 flex w-full items-center justify-center md:mb-20">
        {visibleCount < data.length && (
          <TabButton
            label="더보기"
            selected
            onClick={() => setVisibleCount((c) => c + 6)}
          />
        )}
      </section>
    </div>
  );
}
