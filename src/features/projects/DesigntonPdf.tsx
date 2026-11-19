"use client";

import { useCallback, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import PdfModal from "@/components/ui/PdfModal";

// 디자인톤 상세 맨 아래의 PDF 보기 버튼. 스크롤하는 동안 화면 아래에 붙어 있다가,
// 끝까지 내리면 본문 바로 아래 제자리에 멈춰서 썸네일·요약·푸터를 가리지 않는다.
export default function DesigntonPdf({ id, title, pdfUrl }: { id: string; title: string; pdfUrl: string }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="sticky bottom-3 z-40 mx-auto mt-8 flex w-full max-w-162 items-center justify-between rounded-xl bg-primary-light px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_36px_rgba(3,6,18,0.6)] transition-colors hover:bg-primary-light/85 md:text-base"
      >
        PDF 보기
        <ArrowUpRight size={18} />
      </button>
      {open && (
        <PdfModal
          title={title}
          pdfUrl={pdfUrl}
          onClose={close}
          downloadUrl={`/api/designton/${id}/download`}
        />
      )}
    </>
  );
}
