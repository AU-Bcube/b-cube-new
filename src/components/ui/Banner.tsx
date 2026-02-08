import type { ReactNode } from "react";

interface BannerProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export default function Banner({
  title,
  description,
  action,
}: BannerProps) {
  return (
    <div className="relative w-full overflow-hidden border-b border-border/50">
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex w-full max-w-7xl items-center px-6 py-24 md:px-12 md:py-36">
        <div className="flex flex-col gap-4 md:gap-6">
          <h1 className="text-3xl font-bold tracking-tight text-on-surface md:text-5xl md:leading-tight">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-base leading-relaxed text-muted md:text-lg md:leading-relaxed">
              {description}
            </p>
          )}
          {action}
        </div>
      </div>
    </div>
  );
}
