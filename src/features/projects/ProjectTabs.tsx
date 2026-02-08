"use client";

import { useTabs } from "@/hooks/useTabs";
import TabButton from "@/components/ui/TabButton";
import DesigntonSection from "./DesigntonSection";
import SexyItSection from "./SexyItSection";
import StudySection from "./StudySection";
import EtcSection from "./EtcSection";
import type { Designton, SexyIt, Study, Etc } from "@/types";

interface ProjectTabsProps {
  designtons: Designton[];
  sexyIts: SexyIt[];
  studies: Study[];
  etcs: Etc[];
}

const TAB_LIST = ["디자인톤", "섹시한 IT", "스터디", "기타"];

export default function ProjectTabs({
  designtons,
  sexyIts,
  studies,
  etcs,
}: ProjectTabsProps) {
  const { selectedIndex, setSelectedIndex } = useTabs(TAB_LIST);

  return (
    <div>
      <section className="flex flex-col items-center justify-center">
        <div className="my-8 grid grid-cols-2 gap-2 md:my-16 md:grid-cols-4">
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

      <div className={selectedIndex === 0 ? "block" : "hidden"}>
        <DesigntonSection data={designtons} />
      </div>
      <div className={selectedIndex === 1 ? "block" : "hidden"}>
        <SexyItSection data={sexyIts} />
      </div>
      <div className={selectedIndex === 2 ? "block" : "hidden"}>
        <StudySection data={studies} />
      </div>
      <div className={selectedIndex === 3 ? "block" : "hidden"}>
        <EtcSection data={etcs} />
      </div>
    </div>
  );
}
