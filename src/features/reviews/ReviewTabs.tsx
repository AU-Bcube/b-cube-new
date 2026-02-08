"use client";

import { useTabs } from "@/hooks/useTabs";
import TabButton from "@/components/ui/TabButton";
import InterviewSection from "./InterviewSection";
import PhotoGallery from "./PhotoGallery";
import type { Interview, Photo } from "@/types";

interface ReviewTabsProps {
  interviews: Interview[];
  photos: Photo[];
}

const TAB_LIST = ["OB한마디", "활동사진"];

export default function ReviewTabs({ interviews, photos }: ReviewTabsProps) {
  const { selectedIndex, setSelectedIndex } = useTabs(TAB_LIST);

  return (
    <div>
      <section className="flex flex-col items-center justify-center">
        <div className="my-8 grid grid-cols-2 gap-2 md:my-16">
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

      {selectedIndex === 0 && <InterviewSection data={interviews} />}
      {selectedIndex === 1 && <PhotoGallery photos={photos} />}
    </div>
  );
}
