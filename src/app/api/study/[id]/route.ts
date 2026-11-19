import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Study from "@/lib/models/Study";
import { uploadImage, deleteAsset } from "@/lib/storage";
import { requireAuth } from "@/lib/auth";
import { readStudyDetails, toStudy } from "@/lib/study";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const { id } = await params;
  const item = await Study.findById(id);
  if (!item)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    if (body.title) item.title = body.title;
    if (body.year) item.year = body.year;
    item.set(readStudyDetails((k) => k in body, (k) => body[k]));
  } else {
    const formData = await req.formData();
    const title = formData.get("title") as string | null;
    const year = formData.get("year") as string | null;
    const imageFile = formData.get("imagePath") as File | null;

    if (title) item.title = title;
    if (year) item.year = year;
    item.set(readStudyDetails((k) => formData.has(k), (k) => formData.get(k)));
    if (imageFile && imageFile.size > 0) {
      await deleteAsset(item.imagePath);
      item.imagePath = await uploadImage(imageFile, "study");
    }
  }

  await item.save();
  revalidatePath("/", "layout");
  return NextResponse.json(toStudy(item.toObject()));
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const { id } = await params;
  const study = await Study.findById(id);
  if (!study)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteAsset(study.imagePath);
  await Study.findByIdAndDelete(id);
  revalidatePath("/", "layout");
  return NextResponse.json({ message: "삭제 완료" });
}
