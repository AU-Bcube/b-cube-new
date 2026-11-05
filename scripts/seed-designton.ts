/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Seed script: fills the designton project details from docs/디자인톤_프로젝트_데이터.json.
 * - Existing projects (seedTitle): fill only empty fields, rename seedTitle -> title.
 * - New projects (seedTitle: null): upload ../pdf/<pdf> and ../imgs/<pdf as .png> to R2, then insert.
 * Safe to re-run: existing titles are skipped and admin edits are never overwritten.
 * Run: pnpm tsx scripts/seed-designton.ts
 */

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;
const BUCKET = "bcube";
const IMGS_DIR = path.resolve(__dirname, "../../imgs");
const PDF_DIR = path.resolve(__dirname, "../../pdf");
const DATA = require(path.resolve(__dirname, "../docs/디자인톤_프로젝트_데이터.json"));

type Member = { name: string; role: string };
type Project = {
  seedTitle: string | null;
  title: string;
  year: string;
  summary: string;
  period: string;
  type: string;
  members: Member[];
  award: string | null;
  link: string | null;
  pdf: string;
  description: string;
};

const DesigntonSchema = new mongoose.Schema({
  title: String,
  year: String,
  participant: String,
  imagePath: String,
  pdfPath: String,
  award: String,
  summary: String,
  period: String,
  type: { type: String },
  members: [{ _id: false, name: String, role: String }],
  link: String,
  description: String,
});

let s3: typeof S3Client | null = null;
async function upload(filePath: string): Promise<string | null> {
  if (!fs.existsSync(filePath)) return null;
  s3 ??= new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext).replace(/[^a-zA-Z0-9_-]/g, "");
  const key = `bcube/designton/${Date.now()}-${baseName || "file"}${ext}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: fs.readFileSync(filePath),
      ContentType: ext === ".pdf" ? "application/pdf" : "image/png",
    })
  );
  return `${process.env.R2_PUBLIC_URL!.replace(/\/$/, "")}/${key}`;
}

// 원본 데이터 → DB 필드. 역할이 빈 팀원은 role을 저장하지 않고, 빈 선택 항목은 넣지 않는다.
function details(p: Project) {
  return {
    summary: p.summary,
    type: p.type,
    description: p.description,
    members: p.members.map((m) => (m.role ? m : { name: m.name })),
    ...(p.period && { period: p.period }),
    ...(p.award && { award: p.award }),
    ...(p.link && { link: p.link }),
  };
}

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: "bcube" });
  const Designton = mongoose.models.Designton || mongoose.model("Designton", DesigntonSchema);

  for (const p of DATA as Project[]) {
    if (p.seedTitle) {
      const doc = await Designton.findOne({ title: { $in: [p.seedTitle, p.title] } });
      if (!doc) {
        console.log(`  ⚠ not found, skipped: ${p.seedTitle}`);
        continue;
      }
      // 관리자 페이지에서 이미 채운 값은 덮어쓰지 않는다
      const fill = Object.fromEntries(
        Object.entries(details(p)).filter(([key]) => {
          const cur = doc.get(key);
          return cur === undefined || cur === "" || (Array.isArray(cur) && cur.length === 0);
        })
      );
      if (doc.title === p.seedTitle && p.seedTitle !== p.title) fill.title = p.title;
      if (Object.keys(fill).length === 0) {
        console.log(`  - already filled: ${p.title}`);
        continue;
      }
      doc.set(fill);
      await doc.save();
      console.log(`  ✓ updated: ${p.title} (${Object.keys(fill).join(", ")})`);
      continue;
    }

    if (await Designton.exists({ title: p.title })) {
      console.log(`  - already exists: ${p.title}`);
      continue;
    }
    const pdfUrl = await upload(path.join(PDF_DIR, p.pdf));
    const imgUrl = await upload(path.join(IMGS_DIR, p.pdf.replace(/\.pdf$/, ".png")));
    if (!pdfUrl || !imgUrl) {
      console.log(`  ⚠ PDF or thumbnail missing, skipped: ${p.title} (${p.pdf})`);
      continue;
    }
    await Designton.create({ title: p.title, year: p.year, ...details(p), imagePath: imgUrl, pdfPath: pdfUrl });
    console.log(`  ✓ inserted: ${p.title}`);
  }

  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });

export {};
