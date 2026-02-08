import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Interview from "@/lib/models/Interview";
import { uploadImage, deleteAsset } from "@/lib/storage";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  const item = await Interview.findById(id);
  if (!item)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    if (body.name) item.name = body.name;
    if (body.studentId) item.studentId = body.studentId;
    if (body.introduction) item.introduction = body.introduction;
  } else {
    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    const studentId = formData.get("studentId") as string | null;
    const introduction = formData.get("introduction") as string | null;
    const imageFile = formData.get("imagePath") as File | null;

    if (name) item.name = name;
    if (studentId) item.studentId = Number(studentId);
    if (introduction) item.introduction = introduction;
    if (imageFile && imageFile.size > 0) {
      await deleteAsset(item.imagePath);
      item.imagePath = await uploadImage(imageFile, "interview");
    }
  }

  await item.save();
  return NextResponse.json({
    id: item._id.toString(),
    name: item.name,
    studentId: item.studentId,
    introduction: item.introduction,
    imagePath: item.imagePath,
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  const interview = await Interview.findById(id);
  if (!interview)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteAsset(interview.imagePath);
  await Interview.findByIdAndDelete(id);
  return NextResponse.json({ message: "삭제 완료" });
}
