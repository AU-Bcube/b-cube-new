import Link from "next/link";
import { Mail, MessageCircle, Instagram } from "lucide-react";
import FadeUp from "@/components/ui/FadeUp";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Contact } from "@/types";
import type { ReactNode } from "react";

interface ContactItemProps {
  title: string;
  value: string;
  icon: ReactNode;
  href?: string;
}

function ContactItem({ title, value, icon, href }: ContactItemProps) {
  const inner = (
    <>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light/10 text-primary-light transition-colors duration-300 group-hover:bg-primary-light/20">
        {icon}
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <h6 className="text-sm font-semibold tracking-wide text-on-surface/50">
          {title}
        </h6>
        <p className="text-base font-bold text-on-surface md:text-lg">
          {value}
        </p>
      </div>
    </>
  );

  const className =
    "group flex h-full flex-col items-center justify-center gap-5 glass glass-hover p-8 transition-all duration-300 hover:border-primary-light/30";

  if (href) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        data-no-grid
      >
        {inner}
      </Link>
    );
  }

  return <div data-no-grid className={className}>{inner}</div>;
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
        <FadeUp delay={1} className="h-full">
          <ContactItem
            title="MAIL"
            value={contact.email}
            icon={<Mail size={24} />}
          />
        </FadeUp>
        <FadeUp delay={2} className="h-full">
          <ContactItem
            title="KAKAOTALK"
            value="오픈채팅방"
            icon={<MessageCircle size={24} />}
            href={contact.kakaotalkLink}
          />
        </FadeUp>
        <FadeUp delay={3} className="h-full">
          <ContactItem
            title="INSTAGRAM"
            value="섹시한 IT"
            icon={<Instagram size={24} />}
            href={contact.instagramLink}
          />
        </FadeUp>
      </div>
    </section>
  );
}
