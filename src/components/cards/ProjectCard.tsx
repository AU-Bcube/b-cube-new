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
        onClick={() => pdfUrl && setIsOpen(true)}
        className="group cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-light/20 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-primary/5"
      >
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {award && (
            <span className="absolute right-3 top-3 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold text-black backdrop-blur-sm">
              🏆 {award}
            </span>
          )}
        </div>
        <div className="space-y-1.5 p-5">
          <span className="text-xs font-semibold text-primary-light">
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
