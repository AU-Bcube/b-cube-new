/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * One-off: adds "Content-Disposition: attachment" (file name = project title) to the designton
 * PDFs already in R2, so the download button saves the file instead of opening it.
 * New uploads get the header from uploadPdf in src/lib/storage.ts.
 * Copies each object onto itself with the new header; the file itself does not change.
 * Dry run by default. Add --write to apply.
 * Run: pnpm tsx scripts/set-pdf-attachment.ts [--write]
 */

const { S3Client, CopyObjectCommand } = require("@aws-sdk/client-s3");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const { attachment } = require("../src/lib/storage");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const WRITE = process.argv.includes("--write");
const BUCKET = "bcube";
const PUBLIC_URL = process.env.R2_PUBLIC_URL!.replace(/\/$/, "");

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const DesigntonSchema = new mongoose.Schema({ title: String, pdfPath: String });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!, { dbName: "bcube" });
  const Designton = mongoose.model("Designton", DesigntonSchema);
  const docs: { title: string; pdfPath: string }[] = await Designton.find().lean();

  for (const doc of docs) {
    if (!doc.pdfPath?.startsWith(`${PUBLIC_URL}/`)) {
      console.log(`  ✗ ${doc.title}: 우리 R2 주소가 아님 (${doc.pdfPath})`);
      continue;
    }
    const key = doc.pdfPath.slice(PUBLIC_URL.length + 1);
    console.log(`  ✓ ${doc.title}: ${key}`);
    if (!WRITE) continue;

    await s3.send(
      new CopyObjectCommand({
        Bucket: BUCKET,
        Key: key,
        CopySource: `${BUCKET}/${key.split("/").map(encodeURIComponent).join("/")}`,
        MetadataDirective: "REPLACE",
        ContentType: "application/pdf",
        ContentDisposition: attachment(`${doc.title}.pdf`),
      })
    );
  }

  console.log(WRITE ? `\n${docs.length}건 확인, 헤더 붙임` : `\n${docs.length}건 확인 (적용하려면 --write)`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });

export {};
