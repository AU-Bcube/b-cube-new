import { getContact } from "@/actions/data";
import Banner from "@/components/ui/Banner";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeUp from "@/components/ui/FadeUp";
import ActivityCard from "@/components/cards/ActivityCard";
import RecruitInfo from "@/features/recruit/RecruitInfo";
import ContactSection from "@/features/recruit/ContactSection";

export default async function RecruitPage() {
  const contact = await getContact();

  return (
    <main>
      <Banner
        title="모집이 종료되었습니다!"
        description={
          <>
            지금은 모집 기간이 아닙니다.
            <br />
            다음 모집은 2026년 2월에 예정되어 있습니다.
          </>
        }
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 md:px-12">
        {/* 모집 개요 */}
        <section className="mb-32 flex flex-col items-center justify-center md:mb-48">
          <FadeUp>
            <SectionHeading subject="Introduction" title="모집 개요" />
          </FadeUp>
          <div className="mt-10 grid w-full auto-rows-fr grid-cols-1 gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
            <FadeUp delay={1}>
              <ActivityCard
                title="인재상"
                content={
                  <>
                    최신 IT 기술과 비즈니스 이해를 바탕으로
                    <br />
                    창의적 문제 해결과 협업 능력을 갖춘
                    <br />
                    자기주도적 학습자
                  </>
                }
              />
            </FadeUp>
            <FadeUp delay={2}>
              <ActivityCard
                title="지원자격"
                content={
                  <>
                    IT 기술과 비즈니스에 대한 관심과 열정을 가진
                    <br />
                    아주대학교 학생이라면 누구나
                  </>
                }
              />
            </FadeUp>
            <FadeUp delay={3}>
              <ActivityCard
                title="지원방법"
                content={
                  <>
                    1차 서류
                    <br />
                    2차 면접
                  </>
                }
              />
            </FadeUp>
          </div>
        </section>

        {/* 활동 분야 */}
        <RecruitInfo />

        {/* Contact Us */}
        <ContactSection contact={contact} />
      </div>
    </main>
  );
}
