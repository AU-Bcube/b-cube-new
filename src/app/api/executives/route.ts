import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Executives from "@/lib/models/Executives";
import { uploadImage } from "@/lib/storage";

export async function GET() {
  await dbConnect();
  const execs = await Executives.find().lean();
  return NextResponse.json(
    execs.map((e) => ({
      id: (e._id as object).toString(),
      name: e.name,
      role: e.role,
      studentId: e.studentId,
      imagePath: e.imagePath,
    }))
  );
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const studentId = Number(formData.get("studentId"));
  const imageFile = formData.get("imagePath") as File;

  const imageUrl = await uploadImage(imageFile, "bcube/executives");
  await Executives.create({ name, role, studentId, imagePath: imageUrl });

  revalidatePath("/", "layout");
  return NextResponse.json({ message: "운영진 업로드 완료" });
}
