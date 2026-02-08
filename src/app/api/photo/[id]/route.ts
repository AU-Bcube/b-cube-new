import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Photo from "@/lib/models/Photo";
import { uploadImage, deleteAsset } from "@/lib/storage";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  const item = await Photo.findById(id);
  if (!item)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    if (body.description) item.description = body.description;
    if (body.date) item.date = new Date(body.date);
  } else {
    const formData = await req.formData();
    const description = formData.get("description") as string | null;
    const date = formData.get("date") as string | null;
    const imageFile = formData.get("imagePath") as File | null;

    if (description) item.description = description;
    if (date) item.date = new Date(date);
    if (imageFile && imageFile.size > 0) {
      await deleteAsset(item.imagePath);
      item.imagePath = await uploadImage(imageFile, "photo");
    }
  }

  await item.save();
  return NextResponse.json({
    id: item._id.toString(),
    description: item.description,
    date: item.date,
    imagePath: item.imagePath,
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  const photo = await Photo.findById(id);
  if (!photo)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteAsset(photo.imagePath);
  await Photo.findByIdAndDelete(id);
  return NextResponse.json({ message: "삭제 완료" });
}
