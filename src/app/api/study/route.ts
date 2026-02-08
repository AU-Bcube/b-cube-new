import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Study from "@/lib/models/Study";
import { uploadImage } from "@/lib/storage";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  await dbConnect();
  const studies = await Study.find().sort({ year: -1 }).lean();
  return NextResponse.json(
    studies.map((s) => ({
      id: (s._id as object).toString(),
      year: s.year,
      title: s.title,
      imagePath: s.imagePath,
    }))
  );
}

export async function POST(req: NextRequest) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const formData = await req.formData();
  const year = formData.get("year") as string;
  const title = formData.get("title") as string;
  const imageFile = formData.get("imagePath") as File;

  const imageUrl = await uploadImage(imageFile, "bcube/study");
  await Study.create({ year, title, imagePath: imageUrl });

  revalidatePath("/", "layout");
  return NextResponse.json({ message: "스터디 업로드 완료" });
}
