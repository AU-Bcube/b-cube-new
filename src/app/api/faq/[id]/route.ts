import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import Faq from "@/lib/models/Faq";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const { id } = await params;
  const item = await Faq.findById(id);
  if (!item)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  if (body.category) item.category = body.category;
  if (body.question) item.question = body.question;
  if (body.answer) item.answer = body.answer;

  await item.save();
  revalidatePath("/", "layout");
  return NextResponse.json({
    id: item._id.toString(),
    category: item.category,
    question: item.question,
    answer: item.answer
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
  const item = await Faq.findByIdAndDelete(id);
  if (!item)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  revalidatePath("/", "layout");
  return NextResponse.json({ message: "삭제 완료" });
}
