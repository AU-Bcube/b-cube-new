import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import dbConnect from "@/lib/mongodb";
import Designton from "@/lib/models/Designton";
import { getDownloadUrl } from "@/lib/storage";

// PDF가 최대 수백 MB라 서버를 거치지 않는다. 등록된 디자인톤의 PDF만 R2 임시 다운로드 주소로 보낸다.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!isValidObjectId(id))
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await dbConnect();
  const item = await Designton.findById(id).lean();
  const url = item?.pdfPath && (await getDownloadUrl(item.pdfPath, `${item.title}.pdf`));
  if (!url) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.redirect(url);
}
