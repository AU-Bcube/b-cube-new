import type { Metadata } from 'next';
import Link from 'next/link';
import { getContact, getRecruitActivity, getRecruitOverview } from '@/actions/data';
import Banner from '@/components/ui/Banner';
import SectionHeading from '@/components/ui/SectionHeading';
import FadeUp from '@/components/ui/FadeUp';
import ActivityCard from '@/components/cards/ActivityCard';
import RecruitInfo from '@/features/recruit/RecruitInfo';
import ContactSection from '@/features/recruit/ContactSection';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import AnswerBlock from '@/components/seo/AnswerBlock';
import FaqSection from '@/components/seo/FaqSection';
import JsonLd from '@/components/seo/JsonLd';
import {
  RECRUIT_FAQS,
  SEO_UPDATED_AT,
  SITE,
  absoluteUrl,
} from '@/lib/site';
import {
  createBreadcrumbNode,
  createFaqNode,
  createJsonLdGraph,
  createPageNode,
} from '@/lib/seo';

const pageDescription =
  '비큐브 리크루팅 페이지에서 모집 개요, 활동 분야, 지원 방법과 문의 채널을 확인할 수 있습니다.';

export const metadata: Metadata = {
  title: '리크루팅',
  description: pageDescription,
  openGraph: {
    title: '리크루팅 | 비큐브 B-CUBE',
    description: pageDescription,
    url: '/recruit',
  },
  alternates: {
    canonical: '/recruit',
  },
};

export default async function RecruitPage() {
  const contact = await getContact();
  const recruitOverviews = await getRecruitOverview();
  const recruitActivities = await getRecruitActivity();

  const description = contact.isRecruiting
    ? '비큐브에서 새로운 멤버를 모집하고 있습니다. 모집 개요, 활동 분야, 지원 방법을 확인해 보세요.'
    : pageDescription;

  const potentialAction =
    contact.isRecruiting && contact.recruitLink
      ? {
          '@type': 'ApplyAction',
          name: '비큐브 지원하기',
          target: contact.recruitLink,
        }
      : undefined;

  const jsonLd = createJsonLdGraph([
    createPageNode({
      path: '/recruit',
      name: `리크루팅 | ${SITE.name}`,
      description,
      mainEntity: { '@id': `${absoluteUrl('/recruit')}#faq` },
      potentialAction,
    }),
    createBreadcrumbNode([
      { name: '홈', path: '/' },
      { name: '리크루팅', path: '/recruit' },
    ]),
    createFaqNode('/recruit', RECRUIT_FAQS),
  ]);

  return (
    <main>
      <JsonLd data={jsonLd} />
      <InteractiveGridPattern className="z-0" />
      <Banner
        title={contact.isRecruiting ? '모집 중입니다!' : '모집이 종료되었습니다!'}
        description={
          contact.recruitMessage ||
          (contact.isRecruiting
            ? 'B-CUBE와 함께할 새로운 멤버를 모집하고 있습니다.'
            : '지금은 모집 기간이 아닙니다.\n다음 모집은 추후 공지 예정입니다.')
        }
        action={
          contact.isRecruiting && contact.recruitLink ? (
            <Link
              href={contact.recruitLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit rounded-full bg-primary-light px-8 py-3.5 text-base font-bold text-surface shadow-lg shadow-primary-light/25 transition-all duration-200 hover:bg-primary-light/85 md:px-10 md:py-4 md:text-lg"
            >
              지원하기
            </Link>
          ) : undefined
        }
      />

      <AnswerBlock
        id="recruit-summary"
        eyebrow="AEO Summary"
        title="비큐브 리크루팅에서는 무엇을 확인할 수 있나요?"
        answer="비큐브 리크루팅 페이지에서는 현재 모집 여부, 지원 링크, 모집 개요, 활동 분야, 문의 채널을 확인할 수 있습니다. 지원자는 기획, 마케팅, 개발, 기타 활동 분야 중 관심 분야를 중심으로 비큐브 활동을 이해하고 지원 준비를 할 수 있습니다."
        facts={[
          { label: '모집 상태', value: contact.isRecruiting ? '현재 모집 중' : '현재 모집 종료' },
          { label: '지원 링크', value: contact.recruitLink ? '지원 버튼으로 제공' : '모집 기간 중 공개' },
          { label: '문의 채널', value: contact.email || SITE.social.instagram },
          { label: '활동 분야', value: '기획, 마케팅, 개발, 기타 활동' },
        ]}
        updatedAt={SEO_UPDATED_AT}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 md:px-12">
        {/* 모집 개요 */}
        <section className="mb-32 flex flex-col items-center justify-center md:mb-48">
          <FadeUp>
            <SectionHeading subject="Introduction" title="모집 개요" />
          </FadeUp>
          <div className="mt-10 grid w-full auto-rows-fr grid-cols-1 gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
            {recruitOverviews.map((recruitOverview, i) => {
              const rows = recruitOverview.description.split('\n');

              return (
                <FadeUp key={`${recruitOverview.title}-${i}`} delay={i + 1} className="h-full">
                  <ActivityCard
                    title={recruitOverview.title}
                    content={rows.map((row, index) => (
                      <span key={`${recruitOverview.title}-${index}`}>
                        {row}
                        {index + 1 === rows.length ? null : <br />}
                      </span>
                    ))}
                  />
                </FadeUp>
              );
            })}
          </div>
        </section>

        {/* 활동 분야 */}
        <RecruitInfo recruitActivity={recruitActivities} />

        <FaqSection
          faqs={RECRUIT_FAQS}
          title="리크루팅 자주 묻는 질문"
          description="지원자가 궁금해할 모집 대상, 지원 가능 조건, 확인 경로를 문답형으로 정리했습니다."
        />

        {/* Contact Us */}
        <ContactSection contact={contact} />
      </div>
    </main>
  );
}
