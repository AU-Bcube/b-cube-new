"use client";

import { useTabs } from "@/hooks/useTabs";
import TabButton from "@/components/ui/TabButton";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeUp from "@/components/ui/FadeUp";
import type { ReactNode } from "react";
import {RecruitActivity} from "@/types";

interface BigCardProps {
  title: string;
  content: string;
}

function BigCard({ title, content }: BigCardProps) {
  return (
    <div data-no-grid className="overflow-hidden glass hover:border-primary-light/20 hover:bg-white/6">
      <div className="flex flex-col gap-4 p-8 md:flex-row md:gap-8 md:p-10">
        <h3 className="text-lg font-bold text-on-surface md:min-w-75 md:text-xl">
          {title}
        </h3>
        <ol className="flex flex-col gap-3">
          {content.split('\n').map((item, i) => (
            <li key={i}>
              <p className="text-sm font-medium leading-6 text-on-surface/60 md:text-base md:leading-7">
                {item}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function RecruitInfo({recruitActivity}: { recruitActivity: RecruitActivity[] }) {
  const tabs = [...new Set(recruitActivity.map(recruitActivity => recruitActivity.category))]
  const { selectedIndex, setSelectedIndex } = useTabs(tabs);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <FadeUp>
        <section className="flex flex-col items-center justify-center">
          <SectionHeading subject="Activity" title="활동 분야" />
          <div className="my-8 grid grid-cols-2 gap-2 md:my-14 md:grid-cols-4">
            {tabs.map((tab, i) => (
              <TabButton
                key={tab}
                label={tab}
                selected={selectedIndex === i}
                onClick={() => setSelectedIndex(i)}
              />
            ))}
          </div>
        </section>
      </FadeUp>

      <section className="flex w-full flex-col gap-6 md:gap-10">
        {recruitActivity.filter(recruitActivity => recruitActivity.category === tabs[selectedIndex]).map((card, i) => (
          <FadeUp key={card.title} delay={i + 1}>
            <BigCard title={card.title} content={card.description} />
          </FadeUp>
        ))}
      </section>
    </div>
  );
}
