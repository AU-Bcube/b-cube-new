import Image from "next/image";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Contact } from "@/types";

interface ContactItemProps {
  title: string;
  value: string;
  icon: string;
}

function ContactItem({ title, value, icon }: ContactItemProps) {
  return (
    <div className="flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-light/20 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-primary/5 md:flex-col md:items-center md:gap-5 md:p-8">
      <div className="flex items-center gap-4 md:flex-col md:gap-4">
        <div className="flex h-8 w-8 items-center justify-center md:h-16 md:w-16">
          <Image src={icon} alt={`${title} logo`} width={64} height={64} />
        </div>
        <h6 className="text-sm font-bold text-primary-light md:text-base">
          {title}
        </h6>
      </div>
      <p className="text-center text-sm font-semibold text-on-surface md:text-lg">
        {value}
      </p>
    </div>
  );
}

interface ContactSectionProps {
  contact: Contact;
}

export default function ContactSection({ contact }: ContactSectionProps) {
  return (
    <section className="mb-32 mt-32 flex w-full flex-col items-center justify-center md:mb-48 md:mt-48">
      <FadeUp>
        <SectionHeading subject="Contact" title="Contact Us" />
      </FadeUp>
      <div className="mt-10 grid w-full auto-rows-fr grid-cols-1 gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
        <FadeUp delay={1}>
          <ContactItem
            title="Mail"
            value={contact.email}
            icon="/email_logo2.svg"
          />
        </FadeUp>
        <FadeUp delay={2}>
          <Link
            href={contact.kakaotalkLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full"
          >
            <ContactItem
              title="KakaoTalk"
              value="오픈채팅방"
              icon="/kakaoTalk_logo2.svg"
            />
          </Link>
        </FadeUp>
        <FadeUp delay={3}>
          <Link
            href={contact.instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full"
          >
            <ContactItem
              title="Instagram"
              value="섹시한 IT"
              icon="/insta_logo2.svg"
            />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
