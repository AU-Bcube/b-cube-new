import type { Metadata } from 'next';
import { getDesigntons, getSexyIts, getStudies, getEtcs } from '@/actions/data';
import Banner from '@/components/ui/Banner';
import ProjectTabs from '@/features/projects/ProjectTabs';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import AnswerBlock from '@/components/seo/AnswerBlock';
import FaqSection from '@/components/seo/FaqSection';
import JsonLd from '@/components/seo/JsonLd';
import {
  PROJECT_CATEGORIES,
  PROJECT_FAQS,
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
  '비큐브의 디자인톤, 섹시한 IT, IT 스터디, 외부 프로젝트 결과물을 확인할 수 있습니다.';

export const metadata: Metadata = {
  title: '프로젝트',
  description: pageDescription,
  openGraph: {
    title: '프로젝트 | 비큐브 B-CUBE',
    description: pageDescription,
    url: '/projects',
  },
  alternates: {
    canonical: '/projects',
  },
};

export default async function ProjectsPage() {
  const [designtons, sexyIts, studies, etcs] = await Promise.all([
    getDesigntons(),
    getSexyIts(),
    getStudies(),
    getEtcs(),
  ]);

  const allProjects = [
    ...PROJECT_CATEGORIES.map((category) => ({
      name: category.name,
      description: category.description,
      url: category.url,
    })),
    ...designtons.map((d) => ({
      name: d.title,
      description: `${d.year} 디자인톤 ${d.participant}`,
      url: absoluteUrl('/projects#designton'),
    })),
    ...sexyIts.map((s) => ({
      name: s.title,
      description: `섹시한 IT 카드뉴스 (${s.date})`,
      url: s.url || absoluteUrl('/projects#sexy-it'),
    })),
    ...studies.map((s) => ({
      name: s.title,
      description: `${s.year} IT 스터디`,
      url: absoluteUrl('/projects#study'),
    })),
    ...etcs.map((e) => ({
      name: e.title,
      description: `${e.year} 기타 프로젝트 ${e.participant}`.trim(),
      url: absoluteUrl('/projects#etc'),
    })),
  ];

  const itemList = createItemListNode(
    '/projects',
    '비큐브 프로젝트와 활동 목록',
    allProjects,
  );

  const jsonLd = createJsonLdGraph([
    createPageNode({
      type: 'CollectionPage',
      path: '/projects',
      name: `프로젝트 | ${SITE.name}`,
      description: pageDescription,
      mainEntity: { '@id': `${absoluteUrl('/projects')}#itemlist` },
    }),
    createBreadcrumbNode([
      { name: '홈', path: '/' },
      { name: '프로젝트', path: '/projects' },
    ]),
    createFaqNode('/projects', PROJECT_FAQS),
    itemList,
  ]);

  return (
    <main>
      <JsonLd data={jsonLd} />
      <InteractiveGridPattern className="z-0" />
      <Banner
        title={
          <>
            B-CUBE의 프로젝트를
            <br />
            확인해 보세요
          </>
        }
        description="디자인톤, 섹시한 IT, 스터디 등 다양한 프로젝트 결과물을 만나보세요."
      />

      <AnswerBlock
        id="project-summary"
        eyebrow="AEO Summary"
        title="비큐브 프로젝트에서는 어떤 활동을 확인할 수 있나요?"
        answer="비큐브 프로젝트 페이지는 디자인톤, 섹시한 IT, IT 스터디, 외부 프로젝트와 공모전 결과물을 모아 보여주는 활동 아카이브입니다. 사용자는 프로젝트 카드, 활동 설명, 결과물 링크를 통해 비큐브가 어떤 방식으로 기획·디자인·개발·콘텐츠 제작을 수행하는지 확인할 수 있습니다."
        facts={PROJECT_CATEGORIES.map((category) => ({
          label: category.name,
          value: category.description,
        }))}
        updatedAt={SEO_UPDATED_AT}
      />

      <ProjectTabs
        designtons={designtons}
        sexyIts={sexyIts}
        studies={studies}
        etcs={etcs}
      />

      <FaqSection
        faqs={PROJECT_FAQS}
        title="프로젝트 관련 질문"
        description="프로젝트 페이지의 주요 활동을 검색엔진과 AI 답변엔진이 인용하기 쉽게 문답형으로 정리했습니다."
      />
    </main>
  );
}
