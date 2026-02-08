"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
              className="min-w-0 flex-[0_0_85%] px-2 md:flex-[0_0_33.333%] md:px-3 lg:flex-[0_0_25%] 2xl:flex-[0_0_16.667%]"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface-card/90 text-white/80 backdrop-blur-sm transition hover:bg-surface-light hover:text-white md:left-5 md:h-11 md:w-11"
        aria-label="이전 슬라이드"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface-card/90 text-white/80 backdrop-blur-sm transition hover:bg-surface-light hover:text-white md:right-5 md:h-11 md:w-11"
        aria-label="다음 슬라이드"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dot indicators */}
      <div className="mt-6 flex justify-center gap-1.5">
        {children.map((_, i) => (
          <button
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === selectedIndex
                ? "w-6 bg-primary-light"
                : "w-2 bg-white/20 hover:bg-white/40"
            }`}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`슬라이드 ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
