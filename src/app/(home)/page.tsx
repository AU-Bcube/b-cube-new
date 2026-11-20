import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeUp from "@/components/ui/FadeUp";
import ActivitiesSection from "@/features/home/ActivitiesSection";
import ExecutivesSection from "@/features/home/ExecutivesSection";
import HeroSection from "@/features/home/HeroSection";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import {getActivities, getExecutives, getMainActivities} from "@/actions/data";
import MainActivitiesSection from "@/features/home/MainActivitiesSection";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const [activities, executives, mainActivities] = await Promise.all([
    getActivities(),
    getExecutives(),
    getMainActivities(),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '비큐브 B-CUBE',
    description:
      '아주대학교 경영인텔리전스학과 IT 소학회. 웹/앱 서비스 기획 및 개발.',
    url: 'https://www.b-cube.kr',
    isPartOf: { '@id': 'https://www.b-cube.kr/#website' },
    about: { '@id': 'https://www.b-cube.kr/#organization' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: activities.length,
      itemListElement: activities.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: a.title,
        description: a.description,
      })),
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Interactive grid background */}
      <InteractiveGridPattern className="z-0" />

      {/* Hero Section */}
      <HeroSection />

      {/* Introduction Section */}
      <section id="introduction" className="relative z-10 flex flex-col md:mt-12">
          <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 md:px-12">
              <FadeUp>
                  <SectionHeading subject="Introduction" title="주요 활동" />
              </FadeUp>
              <MainActivitiesSection mainActivities={mainActivities} />
          </div>
      </section>

      {/* Project Carousel Section */}
      <section className="relative z-10 mt-32 flex flex-col md:mt-48">
        <SectionHeading subject="Project" title="프로젝트" />
        <div className="mt-8 w-full md:mt-14">
          <ActivitiesSection activities={activities} />
        </div>
      </section>

      {/* Executives Section */}
      <section className="relative z-10 mb-32 mt-32 flex flex-col items-center justify-center md:mb-48 md:mt-48">
        <FadeUp>
          <div className="flex flex-col gap-4 md:gap-6">
            <SectionHeading subject="Executives" title="운영진 소개" />
            <ExecutivesSection executives={executives} />
          </div>
        </FadeUp>
      </section>
    </main>
  );
}
