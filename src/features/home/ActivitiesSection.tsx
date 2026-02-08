"use client";

import { useState } from "react";
import Image from "next/image";
import PdfModal from "@/components/ui/PdfModal";
import Carousel from "@/components/ui/Carousel";
import type { Activity } from "@/types";

interface ActivitiesSectionProps {
  activities: Activity[];
}

export default function ActivitiesSection({ activities }: ActivitiesSectionProps) {
  const [selectedPdf, setSelectedPdf] = useState<{
    pdfUrl: string;
    title: string;
  } | null>(null);

  if (activities.length === 0) return null;

  return (
    <>
      <Carousel autoPlay loop>
        {activities.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-4/3 w-full cursor-pointer overflow-hidden rounded-2xl"
            onClick={() =>
              setSelectedPdf({ pdfUrl: item.pdfPath, title: item.title })
            }
          >
            <Image
              src={item.imagePath}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5 text-white md:bottom-6 md:left-6 md:right-6">
              <p className="text-xs font-medium text-white/70 md:text-sm">
                {item.description}
              </p>
              <h5 className="mt-1 text-base font-bold md:text-lg">
                {item.title}
              </h5>
            </div>
          </div>
        ))}
      </Carousel>

      {selectedPdf && (
        <PdfModal
          title={selectedPdf.title}
          pdfUrl={selectedPdf.pdfUrl}
          onClose={() => setSelectedPdf(null)}
        />
      )}
    </>
  );
}
