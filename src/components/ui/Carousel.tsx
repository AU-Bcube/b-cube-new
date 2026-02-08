"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

interface CarouselProps {
  children: ReactNode[];
  autoPlay?: boolean;
  loop?: boolean;
}

export default function Carousel({
  children,
  autoPlay = true,
  loop = true,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    align: "center",
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !autoPlay) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(interval);
  }, [emblaApi, autoPlay]);

  return (
    <div className="relative w-full">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {children.map((child, i) => (
            <div
              key={i}
              className="min-w-0 flex-[0_0_85%] px-2 md:flex-[0_0_33.333%] md:px-3 lg:flex-[0_0_20%]"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-border bg-surface-light/90 text-on-surface-dim backdrop-blur-sm transition-all duration-200 hover:border-on-surface-dim/30 hover:text-on-surface md:left-4 md:h-10 md:w-10"
        aria-label="이전 슬라이드"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-border bg-surface-light/90 text-on-surface-dim backdrop-blur-sm transition-all duration-200 hover:border-on-surface-dim/30 hover:text-on-surface md:right-4 md:h-10 md:w-10"
        aria-label="다음 슬라이드"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="mt-6 flex justify-center gap-1.5">
        {children.map((_, i) => (
          <button
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === selectedIndex
                ? "w-6 bg-on-surface"
                : "w-1.5 bg-border hover:bg-muted"
            }`}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`슬라이드 ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
