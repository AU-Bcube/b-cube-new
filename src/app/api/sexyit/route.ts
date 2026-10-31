import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SexyIt, { toKstDateString } from "@/lib/models/SexyIt";

// sexyits2는 크롤러가 관리하므로 추가·수정은 지원하지 않는다
export async function GET() {
  await dbConnect();
  const items = await SexyIt.find().sort({ date: -1 }).lean();
  return NextResponse.json(
    items.map((s) => ({
      id: s.ig_post_id,
      date: toKstDateString(s.date),
      title: s.title,
      imagePath: s.imagePath,
      url: s.url,
    }))
  );
}
