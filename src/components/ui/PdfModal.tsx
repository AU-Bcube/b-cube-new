"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Download, X } from "lucide-react";

interface PdfModalProps {
  title: string;
  pdfUrl: string;
  onClose: () => void;
  // 넘기면 머리줄에 새 탭·다운로드 버튼이 생긴다 (디자인톤 상세)
  downloadUrl?: string;
}

const ACTION =
  "flex h-8 items-center gap-1.5 rounded-lg border border-white/11 bg-white/4 px-2.5 text-xs font-semibold text-[#c7cee1] transition-colors hover:bg-white/9 hover:text-white";

export default function PdfModal({ title, pdfUrl, onClose, downloadUrl }: PdfModalProps) {
  const proxiedUrl = `/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`;
  const viewerUrl = `/pdf-viewer.html?pdfUrl=${encodeURIComponent(proxiedUrl)}`;
  const [page, setPage] = useState<{ page: number; total: number } | null>(null);

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

  // pdf-viewer.html이 알려 주는 지금 페이지
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== "pdf-page") return;
      setPage({ page: e.data.page, total: e.data.total });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(3,6,18,0.88)] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-4 flex h-[calc(100vh-3rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/14 bg-[#0b1026] shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:mx-8 sm:h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-white/10 bg-[#141d45] px-5 py-3.5 md:px-6 md:py-4">
          <h3 className="truncate text-sm font-bold text-white md:text-base">
            {title}
          </h3>
          <span className="text-xs tabular-nums text-[#b8c1d9] md:text-sm">
            {page && `${page.page} / ${page.total}`}
          </span>
          <div className="flex justify-end gap-2">
            {downloadUrl && (
              <>
                <a href={viewerUrl} target="_blank" rel="noopener noreferrer" className={ACTION} aria-label="새 탭에서 열기">
                  <ArrowUpRight size={14} />
                  <span className="hidden sm:inline">새 탭</span>
                </a>
                <a href={downloadUrl} className={ACTION} aria-label="PDF 다운로드">
                  <Download size={14} />
                  <span className="hidden sm:inline">다운로드</span>
                </a>
              </>
            )}
            <button
              onClick={onClose}
              aria-label="닫기"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/11 bg-white/4 text-white transition-colors hover:bg-white/9"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* PDF content */}
        <div className="min-h-0 flex-1">
          <iframe
            src={viewerUrl}
            className="h-full w-full border-0"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
