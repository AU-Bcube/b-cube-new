import type { Metadata } from 'next';
import SectionHeading from '@/components/ui/SectionHeading';
import FadeUp from '@/components/ui/FadeUp';
import ActivitiesSection from '@/features/home/ActivitiesSection';
import ExecutivesSection from '@/features/home/ExecutivesSection';
import InteractiveCube from '@/features/home/InteractiveCube';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import { getActivities, getExecutives, getMainActivities } from '@/actions/data';
import MainActivitiesSection from '@/features/home/MainActivitiesSection';
import AnswerBlock from '@/components/seo/AnswerBlock';
import FaqSection from '@/components/seo/FaqSection';
import JsonLd from '@/components/seo/JsonLd';
import {
  HOME_FAQS,
  SEO_UPDATED_AT,
  SITE,
  absoluteUrl,
} from '@/lib/site';
import {
  createBreadcrumbNode,
  createFaqNode,
  createItemListNode,
  createJsonLdGraph,
  createPageNode,
} from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  const [activities, executives, mainActivities] = await Promise.all([
    getActivities(),
    getExecutives(),
    getMainActivities(),
  ]);

  const activityItems = mainActivities.map((activity) => ({
    name: activity.title,
    description: activity.description.replace(/\n/g, ' '),
    url: absoluteUrl('/projects'),
  }));

  const jsonLd = createJsonLdGraph([
    createPageNode({
      path: '/',
      name: SITE.title,
      description: SITE.description,
      mainEntity: { '@id': `${absoluteUrl('/')}#faq` },
    }),
    createBreadcrumbNode([{ name: '홈', path: '/' }]),
    createFaqNode('/', HOME_FAQS),
    createItemListNode('/', '비큐브 주요 활동', activityItems),
  ]);

  return (
    <main>
      <JsonLd data={jsonLd} />
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
                  'linear-gradient(180deg, #FFFFFF 0%, #F6F6F7 40%, #518CFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              비큐브
              <br />
              B-CUBE
            </h1>
            <p className="text-center text-sm font-bold uppercase tracking-[0.24em] text-primary-light/80 md:text-left md:text-base">
              Broad Business Builder
            </p>
            <h2
              className="text-center text-lg font-semibold md:text-left md:text-xl lg:text-2xl"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #7380B0 0%, #518CFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {SITE.affiliation}
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

      <AnswerBlock
        id="about-bcube"
        eyebrow="AEO Summary"
        title="비큐브 B-CUBE는 어떤 소학회인가요?"
        answer={SITE.extendedDescription}
        facts={[
          { label: '소속', value: SITE.affiliation },
          { label: '핵심 활동', value: '디자인톤, 섹시한 IT, IT 스터디, 웹사이트 기획·개발' },
          { label: '활동 방향', value: '기획, 디자인, 개발, 콘텐츠 제작을 연결한 실전형 프로젝트' },
          { label: '공식 채널', value: 'Instagram, GitHub, KakaoTalk' },
        ]}
        updatedAt={SEO_UPDATED_AT}
      />

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

      <FaqSection
        faqs={HOME_FAQS}
        title="비큐브 핵심 정보"
        description="비큐브의 소속, 활동, 프로젝트 경험을 질문과 답변 형태로 정리했습니다."
      />

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
