import type {Metadata} from "next";
import Link from "next/link";
import {getContact, getRecruitOverview} from "@/actions/data";
import Banner from "@/components/ui/Banner";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeUp from "@/components/ui/FadeUp";
import ActivityCard from "@/components/cards/ActivityCard";
import RecruitInfo from "@/features/recruit/RecruitInfo";
import ContactSection from "@/features/recruit/ContactSection";
import {InteractiveGridPattern} from "@/components/ui/interactive-grid-pattern";

export const metadata: Metadata = {
    title: "리크루팅",
    description:
        "비큐브와 함께할 새로운 멤버를 모집합니다. 모집 개요와 지원 방법을 확인해 보세요.",
    openGraph: {
        title: "리크루팅 | 비큐브 B-cube",
        description:
            "비큐브와 함께할 새로운 멤버를 모집합니다. 모집 개요와 지원 방법을 확인해 보세요.",
        url: "/recruit",
    },
    alternates: {
        canonical: "/recruit",
    },
};

export default async function RecruitPage() {
    const contact = await getContact();
    const recruitOverviews = await getRecruitOverview();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: '리크루팅 | 비큐브 B-CUBE',
        description: contact.isRecruiting
            ? '비큐브에서 새로운 멤버를 모집하고 있습니다. 지금 지원하세요!'
            : '비큐브와 함께할 새로운 멤버를 모집합니다. 모집 개요와 지원 방법을 확인해 보세요.',
        url: 'https://www.b-cube.kr/recruit',
        isPartOf: {'@id': 'https://www.b-cube.kr/#website'},
        ...(contact.isRecruiting && contact.recruitLink && {
            potentialAction: {
                '@type': 'ApplyAction',
                name: '비큐브 지원하기',
                target: contact.recruitLink,
            },
        }),
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
            />
            <InteractiveGridPattern className="z-0"/>
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

            <div
                className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 md:px-12">
                {/* 모집 개요 */}
                <section className="mb-32 flex flex-col items-center justify-center md:mb-48">
                    <FadeUp>
                        <SectionHeading subject="Introduction" title="모집 개요"/>
                    </FadeUp>
                    <div className="mt-10 grid w-full auto-rows-fr grid-cols-1 gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
                        {recruitOverviews.map((recruitOverview, i) => (
                            <FadeUp delay={i + 1} className="h-full">
                                <ActivityCard
                                    title={recruitOverview.title}
                                    content={recruitOverview.description.split("\n").map((row, i) => (
                                        <span key={i}>{row}{i + 1 === recruitOverviews.length ? null : <br/>}</span>
                                    ))}
                                />
                            </FadeUp>
                        ))}
                    </div>
                </section>

                {/* 활동 분야 */}
                <RecruitInfo/>

                {/* Contact Us */}
                <ContactSection contact={contact}/>
            </div>
        </main>
    );
}
