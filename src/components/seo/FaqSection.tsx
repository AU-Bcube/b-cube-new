import type { FaqItem } from '@/lib/site';

interface FaqSectionProps {
  faqs: FaqItem[];
  title?: string;
  description?: string;
}

export default function FaqSection({
  faqs,
  title = '자주 묻는 질문',
  description = '검색엔진과 AI 답변엔진이 핵심 정보를 명확하게 이해할 수 있도록 질문과 답변 형태로 정리했습니다.',
}: FaqSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section className="relative z-10 mx-auto my-24 w-full max-w-5xl px-6 md:my-36 md:px-12">
      <div className="mb-8 flex flex-col gap-3 text-center md:mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-light">
          FAQ
        </p>
        <h2 className="text-2xl font-bold text-on-surface md:text-4xl">
          {title}
        </h2>
        <p className="mx-auto max-w-2xl text-sm font-medium leading-6 text-on-surface/55 md:text-base md:leading-7">
          {description}
        </p>
      </div>

      <dl className="flex flex-col gap-4">
        {faqs.map((faq) => (
          <div key={faq.question} data-no-grid className="glass p-6 md:p-7">
            <dt className="text-base font-bold leading-7 text-on-surface md:text-lg">
              Q. {faq.question}
            </dt>
            <dd className="mt-3 text-sm font-medium leading-7 text-on-surface/65 md:text-base md:leading-8">
              A. {faq.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
