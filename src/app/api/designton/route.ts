import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Designton from "@/lib/models/Designton";
import { uploadImage, uploadPdf } from "@/lib/storage";
import { requireAuth } from "@/lib/auth";
import { parseMembers, REQUIRED_TEXT_FIELDS, OPTIONAL_TEXT_FIELDS } from "@/lib/designton";

export async function GET() {
  await dbConnect();
  const items = await Designton.find().sort({ year: -1 }).lean();
  return NextResponse.json(
    items.map((d) => ({
      id: (d._id as object).toString(),
      title: d.title,
      year: d.year,
      participant: d.participant,
      imagePath: d.imagePath,
      pdfPath: d.pdfPath,
      award: d.award,
      summary: d.summary,
      period: d.period,
      type: d.type,
      members: d.members ?? [],
      link: d.link,
      description: d.description,
    }))
  );
}

export async function POST(req: NextRequest) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const formData = await req.formData();
  const text = (key: string) => String(formData.get(key) ?? "").trim();
  const members = parseMembers(formData.get("members"));
  const imageFile = formData.get("imagePath") as File | null;
  const pdfFile = formData.get("pdfPath") as File | null;

  const missing: string[] = Object.entries(REQUIRED_TEXT_FIELDS)
    .filter(([key]) => !text(key))
    .map(([, label]) => label);
  if (members.length === 0) missing.push("팀원");
  if (!imageFile || imageFile.size === 0) missing.push("이미지");
  if (!pdfFile || pdfFile.size === 0) missing.push("PDF");
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `필수 항목이 비어 있습니다: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const imageUrl = await uploadImage(imageFile!, "bcube/designton");
  const pdfUrl = await uploadPdf(pdfFile!, "bcube/designton");

  const optional = Object.fromEntries(
    OPTIONAL_TEXT_FIELDS.filter((key) => text(key)).map((key) => [key, text(key)])
  );
  await Designton.create({
    title: text("title"),
    year: text("year"),
    summary: text("summary"),
    type: text("type"),
    description: text("description"),
    members,
    ...optional,
    imagePath: imageUrl,
    pdfPath: pdfUrl,
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ message: "디자인톤 업로드 완료" });
}
