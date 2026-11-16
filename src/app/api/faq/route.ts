import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import Faq from "@/lib/models/Faq";

export async function GET() {
  await dbConnect();
  const faqs = await Faq.find({}).sort({ _id: 1 }).lean();
  return NextResponse.json(
    faqs.map((f) => ({
      id: (f._id as object).toString(),
      category: f.category,
      question: f.question,
      answer: f.answer
    }))
  );
}

export async function POST(req: NextRequest) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const formData = await req.formData();
  const category = formData.get("category") as string;
  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;

  await Faq.create({
    category,
    question,
    answer,
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ message: "FAQ 업로드 완료" });
}
