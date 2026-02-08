import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Executives from "@/lib/models/Executives";
import { uploadImage, deleteAsset } from "@/lib/storage";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  const exec = await Executives.findById(id);
  if (!exec)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    if (body.name) exec.name = body.name;
    if (body.role) exec.role = body.role;
    if (body.studentId) exec.studentId = Number(body.studentId);
  } else {
    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    const role = formData.get("role") as string | null;
    const studentId = formData.get("studentId");
    const imageFile = formData.get("imagePath") as File | null;

    if (name) exec.name = name;
    if (role) exec.role = role;
    if (studentId) exec.studentId = Number(studentId);
    if (imageFile && imageFile.size > 0) {
      await deleteAsset(exec.imagePath);
      exec.imagePath = await uploadImage(imageFile, "executives");
    }
  }

  await exec.save();
  revalidatePath("/", "layout");
  return NextResponse.json({
    id: exec._id.toString(),
    name: exec.name,
    role: exec.role,
    studentId: exec.studentId,
    imagePath: exec.imagePath,
  });
}
