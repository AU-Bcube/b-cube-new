import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import SexyIt from "@/lib/models/SexyIt";
import { uploadImage, deleteAsset } from "@/lib/storage";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  const item = await SexyIt.findById(id);
  if (!item)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    if (body.title) item.title = body.title;
    if (body.date) item.date = new Date(body.date);
    if (body.url) item.url = body.url;
  } else {
    const formData = await req.formData();
    const date = formData.get("date") as string | null;
    const title = formData.get("title") as string | null;
    const url = formData.get("url") as string | null;
    const imageFile = formData.get("imagePath") as File | null;

    if (date) item.date = new Date(date);
    if (title) item.title = title;
    if (url) item.url = url;
    if (imageFile && imageFile.size > 0) {
      await deleteAsset(item.imagePath);
      item.imagePath = await uploadImage(imageFile, "sexyit");
    }
  }

  await item.save();
  revalidatePath("/", "layout");
  return NextResponse.json({
    id: item._id.toString(),
    date: item.date.toISOString().split("T")[0],
    title: item.title,
    imagePath: item.imagePath,
    url: item.url,
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  const item = await SexyIt.findById(id);
  if (!item)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteAsset(item.imagePath);
  await SexyIt.findByIdAndDelete(id);
  revalidatePath("/", "layout");
  return NextResponse.json({ message: "삭제 완료" });
}
