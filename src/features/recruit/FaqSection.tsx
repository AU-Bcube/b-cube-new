"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, Mail, MessageCircle, Plus, X } from "lucide-react";
import FadeUp from "@/components/ui/FadeUp";
import SectionHeading from "@/components/ui/SectionHeading";
import TabButton from "@/components/ui/TabButton";
import type { Contact, Faq } from "@/types";

const ALL = "전체";

interface FaqSectionProps {
  faqs: Faq[];
  contact: Contact;
}

export default function FaqSection({ faqs, contact }: FaqSectionProps) {
  const tabs = [ALL, ...new Set(faqs.map((faq) => faq.category))];
  const [selectedTab, setSelectedTab] = useState(ALL);
  const [openId, setOpenId] = useState<string | null>(null);

  const visibleFaqs =
    selectedTab === ALL ? faqs : faqs.filter((faq) => faq.category === selectedTab);

  const selectTab = (tab: string) => {
    setSelectedTab(tab);
    setOpenId(null);
  };

  return (
    <section className="mt-32 mb-32 flex w-full flex-col md:mt-48 md:mb-48">
      <FadeUp>
        <SectionHeading subject="FAQ" title="자주 묻는 질문" />
      </FadeUp>

      <FadeUp delay={1}>
        <div className="my-8 flex flex-wrap justify-center gap-2 md:my-14">
          {tabs.map((tab) => (
            <TabButton
              key={tab}
              label={tab}
              selected={selectedTab === tab}
              onClick={() => selectTab(tab)}
            />
          ))}
        </div>

        <ul className="flex flex-col">
          {visibleFaqs.map((faq) => {
            const open = openId === faq.id;
            return (
              <li
                key={faq.id}
                data-no-grid
                className={
                  open
                    ? "my-2 glass border-primary-light/20 bg-white/6"
                    : "border-b border-white/10"
                }
              >
                <button
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : faq.id)}
                  className="flex w-full items-center gap-3 px-5 py-5 text-left md:px-6"
                >
                  <span className="w-9 shrink-0 text-sm font-bold text-primary-light md:text-base">
                    Q{faqs.indexOf(faq) + 1}.
                  </span>
                  <span className="flex-1 text-sm font-semibold text-on-surface md:text-base">
                    {faq.question}
                  </span>
                  {open ? (
                    <X size={16} className="shrink-0 text-on-surface/70" />
                  ) : (
                    <Plus size={16} className="shrink-0 text-primary-light" />
                  )}
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="whitespace-pre-line pr-5 pb-6 pl-17 text-sm font-medium leading-6 text-on-surface/60 md:pr-6 md:pl-18 md:text-base md:leading-7">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </FadeUp>

      <FadeUp delay={2}>
        <div
          data-no-grid
          className="mt-14 flex flex-col items-center gap-6 glass p-8 hover:border-primary-light/20 hover:bg-white/6 md:mt-16 md:p-10"
        >
          <p className="text-lg font-bold text-on-surface md:text-xl">
            여전히 궁금한 점이 있다면?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {contact.instagramLink && (
              <ContactButton
                href={contact.instagramLink}
                label="인스타그램 문의하기"
                icon={<MessageCircle size={14} />}
                external
              />
            )}
            {contact.email && (
              <ContactButton
                href={`mailto:${contact.email}`}
                label="이메일로 문의하기"
                icon={<Mail size={14} />}
              />
            )}
          </div>
        </div>
      </FadeUp>
    </section>
  );
}

interface ContactButtonProps {
  href: string;
  label: string;
  icon: ReactNode;
  external?: boolean;
}

function ContactButton({ href, label, icon, external }: ContactButtonProps) {
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className="flex items-center gap-2 rounded-full border border-white/20 bg-surface/80 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-surface"
    >
      {icon}
      {label}
      <ArrowRight size={14} />
    </a>
  );
}
