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
    <div className="relative w-full overflow-hidden">
      {/* Subtle top glow that naturally fades out */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-10 h-[300px] w-[500px] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute -left-20 top-0 h-[200px] w-[300px] rounded-full bg-primary-light/8 blur-[120px]" />
      </div>

      {/* Content constrained */}
      <div className="relative mx-auto flex w-full max-w-7xl items-center px-6 py-20 md:px-12 md:py-32">
        <div className="flex flex-col gap-3 md:gap-5">
          <h1 className="text-2xl font-bold text-on-surface md:text-5xl md:leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm font-medium leading-relaxed text-on-surface-dim md:text-lg md:leading-relaxed">
              {description}
            </p>
          )}
          {action}
        </div>
      </div>
    </div>
  );
}
