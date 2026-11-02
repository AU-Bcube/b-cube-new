import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import ActivityReview from "@/lib/models/ActivityReview";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const { id } = await params;
  const item = await ActivityReview.findById(id);
  if (!item)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    if (body.category) item.category = body.category;
    if (body.name) item.name = body.name;
    if (body.studentId) item.studentId = Number(body.studentId);
    if (body.content) item.content = body.content;
  } else {
    const formData = await req.formData();
    const category = formData.get("category") as string | null;
    const name = formData.get("name") as string | null;
    const studentId = formData.get("studentId") as string | null;
    const content = formData.get("content") as string | null;

    if (category) item.category = category;
    if (name) item.name = name;
    if (studentId) item.studentId = Number(studentId);
    if (content) item.content = content;
  }

  await item.save();
  revalidatePath("/", "layout");
  return NextResponse.json({
    id: item._id.toString(),
    category: item.category,
    name: item.name,
    studentId: item.studentId,
    content: item.content,
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
  const review = await ActivityReview.findById(id);
  if (!review)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await ActivityReview.findByIdAndDelete(id);
  revalidatePath("/", "layout");
  return NextResponse.json({ message: "삭제 완료" });
}
