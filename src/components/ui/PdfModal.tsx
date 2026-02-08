"use client";

interface PdfModalProps {
  title: string;
  pdfUrl: string;
  onClose: () => void;
}

export default function PdfModal({ title, pdfUrl, onClose }: PdfModalProps) {
  // Proxy through our API route to avoid CORS issues with Cloudinary
  const proxiedUrl = `/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-4 my-4 w-full max-w-7xl overflow-hidden rounded-xl border border-border bg-surface-light px-6 py-4 sm:mx-8 sm:my-8 md:px-8 md:py-6">
        <div className="mb-2 flex items-center justify-between md:mb-4">
          <h3 className="text-sm font-semibold text-on-surface md:text-lg">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold text-on-surface-dim transition-colors hover:bg-surface hover:text-on-surface"
          >
            &times;
          </button>
        </div>
        <div className="h-[calc(100%-3rem)] flex-grow">
          <iframe
            src={`/pdf-viewer.html?pdfUrl=${encodeURIComponent(proxiedUrl)}`}
            className="h-full w-full"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>
  );
}
