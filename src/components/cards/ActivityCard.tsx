import type { ReactNode } from "react";

interface ActivityCardProps {
  title: string;
  content: ReactNode;
}

export default function ActivityCard({ title, content }: ActivityCardProps) {
  return (
    <div data-no-grid className="group relative h-full overflow-hidden glass p-7 hover:border-primary-light/20 hover:bg-white/6 md:p-8">
      {/* Top edge highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />
      <div className="flex h-full flex-col items-start gap-4 md:gap-5">
        <h3 className="text-lg font-bold text-on-surface md:text-xl">
          {title}
        </h3>
        <p className="text-sm font-medium leading-relaxed text-on-surface/50 md:text-[15px]">
          {content}
        </p>
      </div>
    </div>
  );
}
