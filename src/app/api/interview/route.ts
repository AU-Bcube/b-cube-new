import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Interview from "@/lib/models/Interview";
import { uploadImage } from "@/lib/storage";

export async function GET() {
  await dbConnect();
  const interviews = await Interview.find().lean();
  return NextResponse.json(
    interviews.map((i) => ({
      id: (i._id as object).toString(),
      name: i.name,
      studentId: i.studentId,
      introduction: i.introduction,
      imagePath: i.imagePath,
    }))
  );
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const studentId = Number(formData.get("studentId"));
  const introduction = formData.get("introduction") as string;
  const imageFile = formData.get("imagePath") as File;

  const imageUrl = await uploadImage(imageFile, "bcube/interview");
  await Interview.create({ name, studentId, introduction, imagePath: imageUrl });

  return NextResponse.json({ message: "인터뷰 업로드 완료" });
}
