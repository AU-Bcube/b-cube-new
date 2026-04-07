import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import MainActivity from "@/lib/models/MainActivity";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  await dbConnect();
  const activities = await MainActivity.find().lean();
  return NextResponse.json(
    activities.map((a) => ({
      id: (a._id as object).toString(),
      title: a.title,
      description: a.description,
    }))
  );
}

export async function POST(req: NextRequest) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get('description') as string;

  await MainActivity.create({
    title,
    description,
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ message: "활동 업로드 완료" });
}
