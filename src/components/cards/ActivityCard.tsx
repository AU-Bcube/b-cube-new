import type { ReactNode } from "react";

interface ActivityCardProps {
  title: string;
  content: ReactNode;
}

export default function ActivityCard({ title, content }: ActivityCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-surface-light p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-on-surface-dim/20 hover:bg-surface-card md:p-8">
      <div className="relative z-10 flex h-full flex-col items-start gap-3 md:gap-4">
        <h3 className="text-base font-bold tracking-tight text-on-surface md:text-lg">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted md:text-[15px]">
          {content}
        </p>
      </div>
    </div>
  );
}
