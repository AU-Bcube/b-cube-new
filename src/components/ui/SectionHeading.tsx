interface SectionHeadingProps {
  subject: string;
  title: string;
}

export default function SectionHeading({ subject, title }: SectionHeadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <div className="flex items-center gap-3">
        <div className="h-px w-8 bg-primary-light/40" />
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light md:text-sm">
          {subject}
        </span>
        <div className="h-px w-8 bg-primary-light/40" />
      </div>
      <h2
        className="text-2xl font-bold md:text-4xl"
        style={{
          backgroundImage: "linear-gradient(180deg, #F6F6F7 0%, #7380B0 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {title}
      </h2>
    </div>
  );
}
