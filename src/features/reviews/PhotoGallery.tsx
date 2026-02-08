"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Photo } from "@/types";

interface Props {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (photos.length === 0) return null;

  const prev = () =>
    setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setCurrentIndex((i) => (i + 1) % photos.length);

  return (
    <div className="relative mt-10 flex flex-col items-center py-5 md:mt-16 md:py-10">
      {/* Main image viewer */}
      <div className="flex w-full max-w-3xl items-center justify-center gap-3 px-4 md:gap-6">
        <button
          onClick={prev}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full glass text-white/70 hover:bg-white/6 hover:text-white md:h-12 md:w-12"
          aria-label="이전"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="relative aspect-video w-full max-w-140 overflow-hidden rounded-2xl border border-white/6">
          <Image
            src={photos[currentIndex].imagePath}
            alt={photos[currentIndex].description}
            fill
            className="object-cover object-center transition-all duration-500"
          />
        </div>

        <button
          onClick={next}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full glass text-white/70 hover:bg-white/6 hover:text-white md:h-12 md:w-12"
          aria-label="다음"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <p className="mt-5 text-center text-sm font-medium text-on-surface/70 md:text-base">
        {photos[currentIndex].description}
      </p>

      {/* Thumbnail strip */}
      <div className="mt-8 flex w-full justify-center overflow-hidden px-4 py-2">
        <div
          className="flex gap-3 transition-transform duration-500"
          style={{
            transform: `translateX(calc(50% - 60px - ${currentIndex * 132}px))`,
          }}
        >
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className={`relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all duration-300 md:h-20 md:w-30 ${
                currentIndex === i
                  ? "scale-110 opacity-100"
                  : "opacity-50 hover:opacity-80"
              }`}
              onClick={() => setCurrentIndex(i)}
            >
              <Image
                src={photo.imagePath}
                alt={photo.description}
                fill
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="h-12 md:h-16" />
    </div>
  );
}
