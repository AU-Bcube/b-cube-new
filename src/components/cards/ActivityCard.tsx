import type { ReactNode } from "react";

interface ActivityCardProps {
  title: string;
  content: ReactNode;
}

export default function ActivityCard({ title, content }: ActivityCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-light/20 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-primary/5 md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-light/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10 flex h-full flex-col items-start gap-4 md:gap-5">
        <h3 className="text-lg font-bold text-on-surface md:text-xl">
          {title}
        </h3>
        <p className="text-sm font-medium leading-relaxed text-on-surface/60 md:text-[15px]">
          {content}
        </p>
      </div>
    </div>
  );
}
