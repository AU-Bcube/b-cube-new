interface SectionHeadingProps {
  subject: string;
  title: string;
}

export default function SectionHeading({ subject, title }: SectionHeadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center">
      <span className="rounded-full border border-primary-light/20 bg-primary-light/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-light md:text-sm">
        {subject}
      </span>
      <h2 className="text-2xl font-bold text-on-surface md:text-4xl">
        {title}
      </h2>
    </div>
  );
}
