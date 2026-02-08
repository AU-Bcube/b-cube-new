import SectionHeading from "@/components/ui/SectionHeading";
import FadeUp from "@/components/ui/FadeUp";
import ActivityCard from "@/components/cards/ActivityCard";
import ActivitiesSection from "@/features/home/ActivitiesSection";
import ExecutivesSection from "@/features/home/ExecutivesSection";
import InteractiveCube from "@/features/home/InteractiveCube";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { getActivities, getExecutives } from "@/actions/data";

export default async function HomePage() {
  const [activities, executives] = await Promise.all([
    getActivities(),
    getExecutives(),
  ]);

  return (
    <main>
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <span className="text-xs tracking-widest text-on-surface-dim/50">
            SCROLL
          </span>
          <div className="h-8 w-px animate-pulse bg-linear-to-b from-primary-light/60 to-transparent" />
        </div>
      </div>

      {/* Introduction Section */}
      <section className="relative z-10 flex flex-col md:mt-12">
        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 md:px-12">
          <FadeUp>
            <SectionHeading subject="Introduction" title="주요 활동" />
          </FadeUp>
          <div className="mt-10 grid auto-rows-fr gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
            <FadeUp delay={1} className="h-full">
              <ActivityCard
                title="🎨 디자인톤"
                content={
                  <>
                    서비스 기획부터 UI 디자인, 개발 및 배포까지
                    <br />
                    팀별로 웹/앱 서비스를 직접 구현하는 프로젝트
                  </>
                }
              />
            </FadeUp>
            <FadeUp delay={2} className="h-full">
              <ActivityCard
                title="📱 섹시한 IT"
                content={
                  <>
                    최신 IT 트렌드를 카드뉴스로 제작하고
                    <br />
                    B-CUBE 공식 인스타그램을 통해 공유하는 활동
                  </>
                }
              />
            </FadeUp>
            <FadeUp delay={3} className="h-full">
              <ActivityCard
                title="📚 IT 스터디"
                content={
                  <>
                    java, javascript, python 등<br />
                    다양한 프로그래밍 스터디 진행
                  </>
                }
              />
            </FadeUp>
            <FadeUp delay={4} className="h-full">
              <ActivityCard
                title="🗣️ B-CUBE I TALK"
                content={
                  <>
                    IT 관련 지식과 트렌드를 공유하고
                    <br />
                    데이터베이스화하여 체계적으로 축적하는
                    <br />
                    온라인 지식 공유 활동
                  </>
                }
              />
            </FadeUp>
            <FadeUp delay={5} className="h-full">
              <ActivityCard
                title="🖥️ 웹사이트 기획 및 개발"
                content={
                  <>
                    기획팀, 디자인팀, 개발팀으로 나누어
                    <br />
                    B-CUBE 웹사이트를 체계적으로 기획하고
                    <br />
                    개발하며 지속적으로 발전시키는 활동
                  </>
                }
              />
            </FadeUp>
            <FadeUp delay={6} className="h-full">
              <ActivityCard
                title="💡 신입생 아이디어톤"
                content={
                  <>
                    신입생끼리 서비스를 직접 기획해보고,
                    <br />
                    문제 해결을 위한 창의적인 아이디어를 도출하며
                    <br />
                    실전 기획 경험을 쌓는 프로젝트
                  </>
                }
              />
            </FadeUp>
          </div>
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
