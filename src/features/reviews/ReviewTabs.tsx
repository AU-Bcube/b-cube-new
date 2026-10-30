"use client";

import { useTabs } from "@/hooks/useTabs";
import TabButton from "@/components/ui/TabButton";
import ActivityReviewSection from "./ActivityReviewSection";
import InterviewSection from "./InterviewSection";
import PhotoGallery from "./PhotoGallery";
import type { ActivityReview, Interview, Photo } from "@/types";

interface ReviewTabsProps {
  activityReviews: ActivityReview[];
  interviews: Interview[];
  photos: Photo[];
}

const TAB_LIST = ["활동 별 후기", "OB한마디", "활동사진"];

export default function ReviewTabs({
  activityReviews,
  interviews,
  photos,
}: ReviewTabsProps) {
  const { selectedIndex, setSelectedIndex } = useTabs(TAB_LIST);

  return (
    <div className="relative z-10">
      <section className="flex flex-col items-center justify-center">
        <div className="my-8 flex flex-wrap justify-center gap-2 md:my-16">
          {TAB_LIST.map((tab, i) => (
            <TabButton
              key={tab}
              label={tab}
              selected={selectedIndex === i}
              onClick={() => setSelectedIndex(i)}
            />
          ))}
        </div>
      </section>

      {selectedIndex === 0 && <ActivityReviewSection data={activityReviews} />}
      {selectedIndex === 1 && <InterviewSection data={interviews} />}
      {selectedIndex === 2 && <PhotoGallery photos={photos} />}
    </div>
  );
}
