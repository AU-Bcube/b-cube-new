import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Designton from "@/lib/models/Designton";
import { uploadImage, uploadPdf, deleteAsset } from "@/lib/storage";
import { requireAuth } from "@/lib/auth";
import { parseMembers, REQUIRED_TEXT_FIELDS, OPTIONAL_TEXT_FIELDS } from "@/lib/designton";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const { id } = await params;
  const item = await Designton.findById(id);
  if (!item)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  // 관리자 수정 화면은 파일이 없으면 JSON, 있으면 FormData로 보낸다. 두 경로를 같은 규칙으로 처리한다.
  const contentType = req.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body: Record<string, unknown> = isJson ? await req.json() : {};
  const formData = isJson ? null : await req.formData();
  const has = (key: string) => (isJson ? key in body : formData!.has(key));
  const text = (key: string) =>
    String((isJson ? body[key] : formData!.get(key)) ?? "").trim();

  const emptied: string[] = Object.entries(REQUIRED_TEXT_FIELDS)
    .filter(([key]) => has(key) && !text(key))
    .map(([, label]) => label);
  const members = has("members")
    ? parseMembers(isJson ? body.members : formData!.get("members"))
    : null;
  if (members !== null && members.length === 0) emptied.push("팀원");
  if (emptied.length > 0) {
    return NextResponse.json(
      { error: `필수 항목이 비어 있습니다: ${emptied.join(", ")}` },
      { status: 400 }
    );
  }

  for (const key of Object.keys(REQUIRED_TEXT_FIELDS)) {
    if (has(key)) item.set(key, text(key));
  }
  for (const key of OPTIONAL_TEXT_FIELDS) {
    if (has(key)) item.set(key, text(key) || undefined);
  }
  if (members !== null) item.members = members;

  if (formData) {
    const imageFile = formData.get("imagePath") as File | null;
    const pdfFile = formData.get("pdfPath") as File | null;
    if (imageFile && imageFile.size > 0) {
      await deleteAsset(item.imagePath);
      item.imagePath = await uploadImage(imageFile, "designton");
    }
    if (pdfFile && pdfFile.size > 0) {
      await deleteAsset(item.pdfPath);
      item.pdfPath = await uploadPdf(pdfFile, "designton");
    }
  }

  await item.save();
  revalidatePath("/", "layout");
  return NextResponse.json({
    id: item._id.toString(),
    title: item.title,
    year: item.year,
    participant: item.participant,
    imagePath: item.imagePath,
    pdfPath: item.pdfPath,
    award: item.award,
    summary: item.summary,
    period: item.period,
    type: item.type,
    members: item.members ?? [],
    link: item.link,
    description: item.description,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const { id } = await params;
  const item = await Designton.findById(id);
  if (!item)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteAsset(item.imagePath);
  await deleteAsset(item.pdfPath);
  await Designton.findByIdAndDelete(id);
  revalidatePath("/", "layout");
  return NextResponse.json({ message: "삭제 완료" });
}
