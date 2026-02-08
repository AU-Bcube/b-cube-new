import SectionHeading from "@/components/ui/SectionHeading";
import FadeUp from "@/components/ui/FadeUp";
import ActivityCard from "@/components/cards/ActivityCard";
import ActivitiesSection from "@/features/home/ActivitiesSection";
import ExecutivesSection from "@/features/home/ExecutivesSection";
import { getActivities, getExecutives } from "@/actions/data";

export default async function HomePage() {
  const [activities, executives] = await Promise.all([
    getActivities(),
    getExecutives(),
  ]);

  return (
    <main>
      {/* Hero Section */}
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 md:px-8">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.08] blur-[150px]" />
        </div>

        <div className="relative flex flex-col items-center gap-8 md:gap-12">
          {/* Main title */}
          <h1
            className="text-center text-[52px] font-extrabold leading-[1.1] tracking-tighter md:text-[120px]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #fafafa 0%, #71717a 100%)",
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

          {/* Subtitle & description */}
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-center text-lg font-semibold tracking-tight text-on-surface-dim md:text-3xl">
              아주대학교 경영인텔리전스학과 소학회
            </h2>
            <p className="max-w-xl text-center text-sm leading-relaxed text-muted md:text-base md:leading-relaxed">
              비큐브는 최신 IT 기술에 대한 이해를 바탕으로 웹 및 앱 서비스를 직접
              기획하고 개발하는 소학회입니다.
              <br />
              아이디어를 구현하는 과정에서 기획 능력과 개발 능력을 함께 성장시킬 수
              있습니다.
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
            Scroll
          </span>
          <div className="h-8 w-px animate-pulse bg-gradient-to-b from-on-surface-dim/40 to-transparent" />
        </div>
      </div>

      {/* Introduction Section */}
      <section className="flex flex-col pt-24 md:pt-32">
        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 md:px-12">
          <FadeUp>
            <SectionHeading subject="Introduction" title="주요 활동" />
          </FadeUp>
          <div className="mt-10 grid auto-rows-fr gap-3 md:mt-14 md:grid-cols-3 md:gap-4">
            <FadeUp delay={1}>
              <ActivityCard
                title="디자인톤"
                content={
                  <>
                    서비스 기획부터 UI 디자인, 개발 및 배포까지
                    <br />
                    팀별로 웹/앱 서비스를 직접 구현하는 프로젝트
                  </>
                }
              />
            </FadeUp>
            <FadeUp delay={2}>
              <ActivityCard
                title="섹시한 IT"
                content={
                  <>
                    최신 IT 트렌드를 카드뉴스로 제작하고
                    <br />
                    B-CUBE 공식 인스타그램을 통해 공유하는 활동
                  </>
                }
              />
            </FadeUp>
            <FadeUp delay={3}>
              <ActivityCard
                title="IT 스터디"
                content={
                  <>
                    java, javascript, python 등<br />
                    다양한 프로그래밍 스터디 진행
                  </>
                }
              />
            </FadeUp>
            <FadeUp delay={4}>
              <ActivityCard
                title="B-CUBE I TALK"
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
            <FadeUp delay={5}>
              <ActivityCard
                title="웹사이트 기획 및 개발"
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
            <FadeUp delay={6}>
              <ActivityCard
                title="신입생 아이디어톤"
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
      <section className="mt-28 flex flex-col md:mt-40">
        <SectionHeading subject="Project" title="프로젝트" />
        <div className="mt-8 w-full md:mt-12">
          <ActivitiesSection activities={activities} />
        </div>
      </section>

      {/* Executives Section */}
      <section className="mb-28 mt-28 flex flex-col items-center justify-center md:mb-40 md:mt-40">
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
