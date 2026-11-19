import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import dbConnect from "@/lib/mongodb";
import Designton from "@/lib/models/Designton";

// 다운로드 버튼: DB에 저장된 PDF 주소(pdfPath)로 그대로 보낸다.
// R2 파일에 attachment 헤더가 붙어 있어 브라우저가 열지 않고 바로 저장한다 (storage.ts의 uploadPdf).
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!isValidObjectId(id))
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await dbConnect();
  const item = await Designton.findById(id).lean();
  if (!item?.pdfPath)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.redirect(item.pdfPath);
}
