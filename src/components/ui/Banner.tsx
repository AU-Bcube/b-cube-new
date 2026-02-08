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
    <div className="relative z-10 w-full">
      <div className="relative mx-auto flex w-full max-w-7xl items-center px-6 py-20 md:px-12 md:py-32">
        <div className="flex flex-col gap-5 md:gap-6">
          <h1
            className="text-2xl font-bold md:text-5xl md:leading-tight"
            style={{
              backgroundImage: "linear-gradient(180deg, #F6F6F7 30%, #7380B0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {title}
          </h1>
          {description && (
            <p className="text-sm font-medium leading-relaxed text-on-surface-dim/70 md:text-lg md:leading-relaxed">
              {description}
            </p>
          )}
          {action}
        </div>
      </div>
      {/* Bottom separator */}
      <div className="mx-6 h-px bg-linear-to-r from-transparent via-primary-light/20 to-transparent md:mx-12" />
    </div>
  );
}
