"use client";

import { useState, Fragment } from "react";
import ReviewCard from "@/components/cards/ReviewCard";
import TabButton from "@/components/ui/TabButton";
import { ACTIVITY_REVIEW_CATEGORIES as CATEGORIES } from "@/lib/activityReviewCategories";
import type { ActivityReview } from "@/types";

interface Props {
  data: ActivityReview[];
}

export default function ActivityReviewSection({ data }: Props) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = data.filter((review) => review.category === category);
  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="mx-auto flex max-w-287.5 flex-col items-center gap-10 px-8 md:gap-20 md:px-0">
      <div className="flex w-full flex-col gap-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-base font-semibold leading-8 md:text-xl">
          {CATEGORIES.map((c, i) => (
            <Fragment key={c}>
              {i > 0 && <span className="text-white/40">|</span>}
              <button
                className={`transition-colors duration-300 ${
                  category === c
                    ? "text-[#5A9EDB]"
                    : "text-white/40 hover:text-white/70"
                }`}
                onClick={() => {
                  setCategory(c);
                  setVisibleCount(6);
                }}
              >
                {c}
              </button>
            </Fragment>
          ))}
        </div>

        {visible.length > 0 ? (
          <div className="columns-1 gap-8.75 md:columns-3">
            {visible.map((review) => (
              <div key={review.id} className="mb-8.75 break-inside-avoid">
                <ReviewCard
                  name={review.name}
                  studentId={review.studentId}
                  content={review.content}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-base font-medium text-white/40">
            아직 등록된 후기가 없어요.
          </p>
        )}
      </div>

      <section className="mb-10 flex w-full items-center justify-center md:mb-20">
        {visibleCount < filtered.length && (
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
