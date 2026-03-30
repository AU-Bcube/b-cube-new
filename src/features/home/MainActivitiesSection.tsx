"use client";

import type { MainActivity } from "@/types";
import FadeUp from "@/components/ui/FadeUp";
import ActivityCard from "@/components/cards/ActivityCard";

interface MainActivitiesSectionProps {
  mainActivities: MainActivity[];
}

export default function MainActivitiesSection({ mainActivities }: MainActivitiesSectionProps) {
  if (mainActivities.length === 0) return null;

  return (
    <div className="mt-10 grid auto-rows-fr gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
      {mainActivities.map((item, i) => (
        <FadeUp key={item.id} delay={i} className="h-full">
          <ActivityCard
            title={item.title}
            content={item.description.split("\n").map((row, i) => (
              <span key={i}>
                {row}
                {i + 1 === mainActivities.length ? null : <br />}
              </span>
            ))}
          />
        </FadeUp>
      ))}
    </div>
  );
}
