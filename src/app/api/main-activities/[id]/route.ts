import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import MainActivity from '@/lib/models/MainActivity';
import { requireAuth } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const { id } = await params;
  const item = await MainActivity.findById(id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const body = await req.json();
    if (body.title) item.title = body.title;
    if (body.description) item.description = body.description;
  } else {
    const formData = await req.formData();
    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;

    if (title) item.title = title;
    if (description) item.description = description;
  }

  await item.save();
  revalidatePath('/', 'layout');
  return NextResponse.json({
    id: item._id.toString(),
    title: item.title,
    description: item.description,
  });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const { id } = await params;
  const activity = await MainActivity.findById(id);
  if (!activity) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await MainActivity.findByIdAndDelete(id);
  revalidatePath('/', 'layout');
  return NextResponse.json({ message: '삭제 완료' });
}
