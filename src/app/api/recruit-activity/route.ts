import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import RecruitActivity from "@/lib/models/RecruitActivity";

export async function GET() {
  await dbConnect();
  const activities = await RecruitActivity.find({}).lean();
  return NextResponse.json(
    activities.map((a) => ({
      id: (a._id as object).toString(),
      title: a.title,
      category: a.category,
      description: a.description
    }))
  );
}

export async function POST(req: NextRequest) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;

  await RecruitActivity.create({
    title,
    category,
    description,
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ message: "리쿠르팅 활동분야 업로드 완료" });
}
