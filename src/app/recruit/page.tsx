import Link from "next/link";
import { getContact } from "@/actions/data";
import Banner from "@/components/ui/Banner";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeUp from "@/components/ui/FadeUp";
import ActivityCard from "@/components/cards/ActivityCard";
import RecruitInfo from "@/features/recruit/RecruitInfo";
import ContactSection from "@/features/recruit/ContactSection";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

export default async function RecruitPage() {
  const contact = await getContact();

  return (
    <main>
      <InteractiveGridPattern className="z-0" />
      <Banner
        title={contact.isRecruiting ? "모집 중입니다!" : "모집이 종료되었습니다!"}
        description={
          contact.recruitMessage
            || (contact.isRecruiting
              ? "B-CUBE와 함께할 새로운 멤버를 모집하고 있습니다."
              : "지금은 모집 기간이 아닙니다.\n다음 모집은 추후 공지 예정입니다.")
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

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 md:px-12">
        {/* 모집 개요 */}
        <section className="mb-32 flex flex-col items-center justify-center md:mb-48">
          <FadeUp>
            <SectionHeading subject="Introduction" title="모집 개요" />
          </FadeUp>
          <div className="mt-10 grid w-full auto-rows-fr grid-cols-1 gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
            <FadeUp delay={1} className="h-full">
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
            <FadeUp delay={2} className="h-full">
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
            <FadeUp delay={3} className="h-full">
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
