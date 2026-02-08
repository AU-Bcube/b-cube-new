import { getDesigntons, getSexyIts, getStudies, getEtcs } from "@/actions/data";
import Banner from "@/components/ui/Banner";
import ProjectTabs from "@/features/projects/ProjectTabs";

export default async function ProjectsPage() {
  const [designtons, sexyIts, studies, etcs] = await Promise.all([
    getDesigntons(),
    getSexyIts(),
    getStudies(),
    getEtcs(),
  ]);

  return (
    <main>
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
