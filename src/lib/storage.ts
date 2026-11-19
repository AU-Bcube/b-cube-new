import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

let _s3: S3Client | null = null;

function getS3() {
  if (!_s3) {
    _s3 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return _s3;
}

const BUCKET = "bcube";

function generatePath(folder: string, fileName: string) {
  const timestamp = Date.now();
  const ext = fileName.substring(fileName.lastIndexOf("."));
  const baseName = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "");
  return `${folder}/${timestamp}-${baseName || "file"}${ext}`;
}

export async function uploadImage(
  file: File,
  folder: string
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const key = generatePath(folder, file.name);

  await getS3().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

export async function uploadPdf(
  file: File,
  folder: string
): Promise<string> {
  return uploadImage(file, folder);
}

export async function deleteAsset(url: string) {
  if (!url) return;
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl) return;
  const key = url.replace(`${publicUrl}/`, "");
  if (!key || key === url) return;

  await getS3().send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}
