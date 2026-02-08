import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Designton from "@/lib/models/Designton";
import { uploadImage, uploadPdf, deleteAsset } from "@/lib/storage";
import { requireAuth } from "@/lib/auth";

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

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    if (body.title) item.title = body.title;
    if (body.year) item.year = body.year;
    if (body.participant !== undefined) item.participant = body.participant;
    if (body.award !== undefined) item.award = body.award;
  } else {
    const formData = await req.formData();
    const title = formData.get("title") as string | null;
    const year = formData.get("year") as string | null;
    const participant = formData.get("participant") as string | null;
    const award = formData.get("award") as string | null;
    const imageFile = formData.get("imagePath") as File | null;
    const pdfFile = formData.get("pdfPath") as File | null;

    if (title) item.title = title;
    if (year) item.year = year;
    if (participant) item.participant = participant;
    if (award !== null) item.award = award || undefined;
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
