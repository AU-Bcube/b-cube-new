type FactItem = {
  label: string;
  value: string;
};

interface AnswerBlockProps {
  id?: string;
  eyebrow: string;
  title: string;
  answer: string;
  facts?: FactItem[];
  updatedAt?: string;
}

export default function AnswerBlock({
  id,
  eyebrow,
  title,
  answer,
  facts = [],
  updatedAt,
}: AnswerBlockProps) {
  return (
    <section
      id={id}
      className="relative z-10 mx-auto w-full max-w-5xl px-6 md:px-12"
    >
      <div data-no-grid className="glass p-7 md:p-10">
        <div className="flex flex-col gap-4 md:gap-5">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-light">
            {eyebrow}
          </p>
          <h2 className="text-2xl font-bold leading-tight text-on-surface md:text-4xl">
            {title}
          </h2>
          <p className="text-sm font-medium leading-7 text-on-surface/70 md:text-base md:leading-8">
            {answer}
          </p>

          {facts.length > 0 && (
            <dl className="mt-3 grid gap-3 md:grid-cols-2">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-2xl border border-white/6 bg-white/[0.03] p-4"
                >
                  <dt className="text-xs font-semibold uppercase tracking-wider text-on-surface/40">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold leading-6 text-on-surface/85">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {updatedAt && (
            <p className="text-xs font-medium text-on-surface/35">
              마지막 업데이트: {updatedAt}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
