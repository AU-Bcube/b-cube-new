import type { Metadata } from 'next';
import { getInterviews, getPhotos } from '@/actions/data';
import Banner from '@/components/ui/Banner';
import ReviewTabs from '@/features/reviews/ReviewTabs';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import AnswerBlock from '@/components/seo/AnswerBlock';
import FaqSection from '@/components/seo/FaqSection';
import JsonLd from '@/components/seo/JsonLd';
import {
  REVIEW_FAQS,
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

const pageDescription =
  '비큐브 선배들의 인터뷰와 활동 사진을 통해 실제 활동 경험과 프로젝트 성과를 확인해 보세요.';

export const metadata: Metadata = {
  title: '후기',
  description: pageDescription,
  openGraph: {
    title: '후기 | 비큐브 B-CUBE',
    description: pageDescription,
    url: '/reviews',
  },
  alternates: {
    canonical: '/reviews',
  },
};

export default async function ReviewsPage() {
  const [interviews, photos] = await Promise.all([
    getInterviews(),
    getPhotos(),
  ]);

  const interviewItems = interviews.map((interview) => ({
    name: `${interview.name} 인터뷰`,
    description: interview.introduction,
    url: absoluteUrl('/reviews'),
  }));

  const jsonLd = createJsonLdGraph([
    createPageNode({
      type: 'CollectionPage',
      path: '/reviews',
      name: `후기 | ${SITE.name}`,
      description: pageDescription,
      mainEntity: { '@id': `${absoluteUrl('/reviews')}#itemlist` },
    }),
    createBreadcrumbNode([
      { name: '홈', path: '/' },
      { name: '후기', path: '/reviews' },
    ]),
    createFaqNode('/reviews', REVIEW_FAQS),
    createItemListNode('/reviews', '비큐브 선배 인터뷰 목록', interviewItems),
  ]);

  return (
    <main>
      <JsonLd data={jsonLd} />
      <InteractiveGridPattern className="z-0" />
      <Banner
        title={
          <>
            B-CUBE의 생생한 후기들을
            <br />
            지금 확인해 보세요
          </>
        }
        description="선배들의 인터뷰와 활동 사진을 확인해 보세요."
      />

      <AnswerBlock
        id="review-summary"
        eyebrow="AEO Summary"
        title="비큐브 후기 페이지에서는 무엇을 확인할 수 있나요?"
        answer="비큐브 후기 페이지는 선배 인터뷰와 활동 사진을 통해 비큐브의 실제 활동 경험, 프로젝트 협업 분위기, 학술제와 해커톤 등 활동 성과를 보여주는 아카이브입니다."
        facts={[
          { label: '콘텐츠', value: 'OB 인터뷰와 활동 사진' },
          { label: '확인 가능한 정보', value: '활동 경험, 협업 분위기, 프로젝트 성과' },
          { label: '사진 자료', value: `${photos.length}개의 활동 사진 데이터` },
          { label: '인터뷰 자료', value: `${interviews.length}개의 선배 인터뷰 데이터` },
        ]}
        updatedAt={SEO_UPDATED_AT}
      />

      <ReviewTabs interviews={interviews} photos={photos} />

      <FaqSection
        faqs={REVIEW_FAQS}
        title="후기 관련 질문"
        description="비큐브 활동 후기와 활동 사진의 의미를 문답형으로 정리했습니다."
      />
    </main>
  );
}
