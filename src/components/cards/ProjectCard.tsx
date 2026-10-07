"use client";

import { useState } from "react";
import Image from "next/image";
import PdfModal from "@/components/ui/PdfModal";

interface ProjectCardProps {
  image: string;
  year: string;
  title: string;
  participants?: string;
  pdfUrl?: string;
  award?: string;
}

export default function ProjectCard({
  image,
  year,
  title,
  participants,
  pdfUrl,
  award,
}: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        data-no-grid
        onClick={() => pdfUrl && setIsOpen(true)}
        className="group cursor-pointer overflow-hidden glass hover:border-primary-light/20 hover:bg-white/6"
      >
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[rgba(8,14,30,0.8)] to-transparent" />
          {award && (
            <span className="absolute right-3 top-3 rounded-full border border-amber-400/30 bg-amber-500/90 px-3 py-1 text-xs font-bold text-black">
              {award}
            </span>
          )}
        </div>
        <div className="space-y-1.5 p-5">
          <span className="text-xs font-semibold tracking-wide text-primary-light">
            {year}
          </span>
          <h5 className="truncate text-lg font-bold text-on-surface">
            {title}
          </h5>
          {participants && (
            <p className="text-sm text-on-surface/40">{participants}</p>
          )}
        </div>
      </div>

      {isOpen && pdfUrl && (
        <PdfModal
          title={title}
          pdfUrl={pdfUrl}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
