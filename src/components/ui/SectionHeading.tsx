interface SectionHeadingProps {
  subject: string;
  title: string;
}

export default function SectionHeading({ subject, title }: SectionHeadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center">
      <span className="rounded-md border border-border bg-surface-light px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted md:text-sm">
        {subject}
      </span>
      <h2 className="text-2xl font-bold tracking-tight text-on-surface md:text-4xl">
        {title}
      </h2>
    </div>
  );
}
