import type { Metadata } from "next";
import { getInterviews, getPhotos } from "@/actions/data";
import Banner from "@/components/ui/Banner";
import ReviewTabs from "@/features/reviews/ReviewTabs";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

export const metadata: Metadata = {
  title: "후기",
  description:
    "비큐브 선배들의 생생한 인터뷰와 활동 사진을 확인해 보세요.",
  openGraph: {
    title: "후기 | 비큐브 B-cube",
    description:
      "비큐브 선배들의 생생한 인터뷰와 활동 사진을 확인해 보세요.",
    url: "/reviews",
  },
  alternates: {
    canonical: "/reviews",
  },
};

export default async function ReviewsPage() {
  const [interviews, photos] = await Promise.all([
    getInterviews(),
    getPhotos(),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '후기 | 비큐브 B-CUBE',
    description:
      '비큐브 선배들의 생생한 인터뷰와 활동 사진을 확인해 보세요.',
    url: 'https://www.b-cube.kr/reviews',
    isPartOf: { '@id': 'https://www.b-cube.kr/#website' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: interviews.length,
      itemListElement: interviews.map((iv, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Review',
          author: { '@type': 'Person', name: iv.name },
          reviewBody: iv.introduction,
          itemReviewed: { '@id': 'https://www.b-cube.kr/#organization' },
        },
      })),
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
      <ReviewTabs interviews={interviews} photos={photos} />
    </main>
  );
}
