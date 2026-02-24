import type { Metadata } from "next";
import { getDesigntons, getSexyIts, getStudies, getEtcs } from "@/actions/data";
import Banner from "@/components/ui/Banner";
import ProjectTabs from "@/features/projects/ProjectTabs";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

export const metadata: Metadata = {
  title: "프로젝트",
  description:
    "비큐브의 디자인톤, 섹시한 IT, 스터디 등 다양한 프로젝트 결과물을 확인해 보세요.",
  openGraph: {
    title: "프로젝트 | 비큐브 B-cube",
    description:
      "비큐브의 디자인톤, 섹시한 IT, 스터디 등 다양한 프로젝트 결과물을 확인해 보세요.",
    url: "/projects",
  },
  alternates: {
    canonical: "/projects",
  },
};

export default async function ProjectsPage() {
  const [designtons, sexyIts, studies, etcs] = await Promise.all([
    getDesigntons(),
    getSexyIts(),
    getStudies(),
    getEtcs(),
  ]);

  const allProjects: { name: string; description: string }[] = [
    ...designtons.map((d) => ({ name: d.title, description: `디자인톤 (${d.year})` })),
    ...sexyIts.map((s) => ({ name: s.title, description: '섹시한 IT' })),
    ...studies.map((s) => ({ name: s.title, description: `스터디 (${s.year})` })),
    ...etcs.map((e) => ({ name: e.title, description: `기타 (${e.year})` })),
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '프로젝트 | 비큐브 B-CUBE',
    description:
      '비큐브의 디자인톤, 섹시한 IT, 스터디 등 다양한 프로젝트 결과물을 확인해 보세요.',
    url: 'https://www.b-cube.kr/projects',
    isPartOf: { '@id': 'https://www.b-cube.kr/#website' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allProjects.length,
      itemListElement: allProjects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        description: p.description,
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
            B-CUBE의 프로젝트를
            <br />
            확인해 보세요
          </>
        }
        description="디자인톤, 섹시한 IT, 스터디 등 다양한 프로젝트 결과물을 만나보세요."
      />
      <ProjectTabs
        designtons={designtons}
        sexyIts={sexyIts}
        studies={studies}
        etcs={etcs}
      />
    </main>
  );
}
