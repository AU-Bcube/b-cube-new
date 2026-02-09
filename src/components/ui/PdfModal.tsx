"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface PdfModalProps {
  title: string;
  pdfUrl: string;
  onClose: () => void;
}

export default function PdfModal({ title, pdfUrl, onClose }: PdfModalProps) {
  const proxiedUrl = `/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`;

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-4 flex h-[calc(100vh-3rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/8 bg-[#0c1225] shadow-2xl sm:mx-8 sm:h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/6 px-5 py-3.5 md:px-6 md:py-4">
          <h3 className="truncate text-sm font-bold text-on-surface md:text-base">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/6 text-on-surface/60 transition-colors hover:bg-white/12 hover:text-on-surface"
          >
            <X size={16} />
          </button>
        </div>

        {/* PDF content */}
        <div className="min-h-0 flex-1">
          <iframe
            src={`/pdf-viewer.html?pdfUrl=${encodeURIComponent(proxiedUrl)}`}
            className="h-full w-full border-0"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
