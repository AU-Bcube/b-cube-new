"use client";

import { useRef } from "react";
import { Download, Maximize } from "lucide-react";

const BUTTON =
  "flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#141d47] px-3 py-2 text-xs text-on-surface/90 transition-colors hover:border-primary-light/30";

// 디자인톤 상세 페이지 아래쪽 PDF 뷰어. PDF는 기존 방식(pdf-proxy + pdf-viewer.html)으로 불러온다.
export default function DesigntonPdf({ id, pdfUrl }: { id: string; pdfUrl: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const viewerUrl = `/pdf-viewer.html?pdfUrl=${encodeURIComponent(
    `/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`
  )}`;

  // 아이폰 사파리는 요소 전체화면을 지원하지 않아 새 탭으로 연다
  const openFullscreen = () => {
    if (document.fullscreenEnabled) frame.current?.requestFullscreen();
    else window.open(viewerUrl, "_blank");
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-on-surface md:text-xl">PDF 뷰어</h2>
        <div className="flex gap-2">
          <a href={`/api/designton/${id}/download`} className={BUTTON}>
            <Download size={12} />
            다운로드
          </a>
          <button type="button" onClick={openFullscreen} className={BUTTON}>
            <Maximize size={12} />
            전체화면
          </button>
        </div>
      </div>
      <iframe
        ref={frame}
        src={viewerUrl}
        title="PDF 뷰어"
        className="h-[80vh] w-full rounded-2xl border-0"
      />
    </section>
  );
}
