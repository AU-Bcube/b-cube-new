import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

// ponytail: client-s3와 presigner가 서로 다른 @smithy/types 사본을 써서 타입만 어긋난다 (실행은 같음).
// 두 패키지를 같은 버전으로 함께 올리면 이 캐스트를 지우고 getSignedUrl을 바로 쓰면 된다.
const sign = getSignedUrl as unknown as (
  client: S3Client,
  command: GetObjectCommand,
  options: { expiresIn: number }
) => Promise<string>;

// 브라우저가 열지 않고 바로 저장하도록 "attachment" 표시를 붙인 5분짜리 R2 주소.
// 우리 버킷의 공개 주소가 아니면 null.
export async function getDownloadUrl(url: string, fileName: string) {
  const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  if (!publicUrl || !url.startsWith(`${publicUrl}/`)) return null;
  const key = url.slice(publicUrl.length + 1);
  // filename*에는 '()*를 쓸 수 없어 encodeURIComponent가 남기는 것까지 바꾼다
  const encoded = encodeURIComponent(fileName).replace(
    /['()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  );

  return sign(
    getS3(),
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ResponseContentDisposition: `attachment; filename="designton.pdf"; filename*=UTF-8''${encoded}`,
    }),
    { expiresIn: 300 }
  );
}
