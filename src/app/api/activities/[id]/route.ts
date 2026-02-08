import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Activities from "@/lib/models/Activities";
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
  const item = await Activities.findById(id);
  if (!item)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    if (body.title) item.title = body.title;
    if (body.description) item.description = body.description;
  } else {
    const formData = await req.formData();
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const imageFile = formData.get("imagePath") as File | null;
    const pdfFile = formData.get("pdfPath") as File | null;

    if (title) item.title = title;
    if (description) item.description = description;
    if (imageFile && imageFile.size > 0) {
      await deleteAsset(item.imagePath);
      item.imagePath = await uploadImage(imageFile, "activities");
    }
    if (pdfFile && pdfFile.size > 0) {
      await deleteAsset(item.pdfPath);
      item.pdfPath = await uploadPdf(pdfFile, "activities");
    }
  }

  await item.save();
  revalidatePath("/", "layout");
  return NextResponse.json({
    id: item._id.toString(),
    title: item.title,
    description: item.description,
    imagePath: item.imagePath,
    pdfPath: item.pdfPath,
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
  const activity = await Activities.findById(id);
  if (!activity)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteAsset(activity.imagePath);
  await deleteAsset(activity.pdfPath);
  await Activities.findByIdAndDelete(id);
  revalidatePath("/", "layout");
  return NextResponse.json({ message: "삭제 완료" });
}
