import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeUp from "@/components/ui/FadeUp";
import ActivitiesSection from "@/features/home/ActivitiesSection";
import ExecutivesSection from "@/features/home/ExecutivesSection";
import InteractiveCube from "@/features/home/InteractiveCube";
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
      <div className="relative z-10 flex h-screen min-h-150 flex-col items-center justify-center overflow-hidden px-6 md:min-h-180 md:px-12 lg:px-20">
        <div className="flex w-full max-w-6xl flex-col items-center gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
          {/* Text content */}
          <div className="order-2 flex flex-col items-center gap-4 md:order-1 md:flex-1 md:items-start md:gap-5">
            <h1
              className="text-center text-5xl font-bold leading-tight tracking-tight md:text-left md:text-7xl lg:text-8xl"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, #FFFFFF 0%, #F6F6F7 40%, #518CFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              BROAD
              <br />
              BUSINESS
              <br />
              BUILDER
            </h1>
            <h2
              className="text-center text-lg font-semibold md:text-left md:text-xl lg:text-2xl"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #7380B0 0%, #518CFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              아주대학교 경영인텔리전스학과 소학회
            </h2>
            <p className="max-w-lg text-center text-sm font-medium leading-6 text-on-surface-dim/70 md:text-left md:text-base md:leading-7">
              비큐브는 최신 IT 기술에 대한 이해를 바탕으로 웹 및 앱 서비스를 직접
              기획하고 개발하는 소학회입니다. 아이디어를 구현하는 과정에서 기획
              능력과 개발 능력을 함께 성장시킬 수 있습니다.
            </p>
          </div>

          {/* Interactive 3D Cube */}
          <div className="order-1 flex min-w-0 items-center justify-center md:order-2">
            <InteractiveCube />
          </div>
        </div>

      </div>

      {/* Introduction Section */}
      <section className="relative z-10 flex flex-col md:mt-12">
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
