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
        className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-surface-light transition-all duration-300 hover:-translate-y-0.5 hover:border-on-surface-dim/20"
      >
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent" />
          {award && (
            <span className="absolute right-3 top-3 rounded-md bg-amber-400/90 px-2.5 py-1 text-xs font-bold text-surface backdrop-blur-sm">
              {award}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5 p-5">
          <span className="text-xs font-semibold text-primary-light">
            {year}
          </span>
          <h5 className="truncate text-base font-bold tracking-tight text-on-surface">
            {title}
          </h5>
          {participants && (
            <p className="text-sm text-muted">{participants}</p>
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
