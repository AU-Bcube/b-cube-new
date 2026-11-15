import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import ActivityReview from "@/lib/models/ActivityReview";

export async function GET() {
  await dbConnect();
  const reviews = await ActivityReview.find().lean();
  return NextResponse.json(
    reviews.map((r) => ({
      id: (r._id as object).toString(),
      category: r.category,
      name: r.name,
      studentId: r.studentId,
      content: r.content,
    }))
  );
}

export async function POST(req: NextRequest) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const formData = await req.formData();
  const category = formData.get("category") as string;
  const name = formData.get("name") as string;
  const studentId = Number(formData.get("studentId"));
  const content = formData.get("content") as string;

  await ActivityReview.create({ category, name, studentId, content });

  revalidatePath("/", "layout");
  return NextResponse.json({ message: "활동 별 후기 업로드 완료" });
}
