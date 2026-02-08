/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Seed script: uploads imgs/ and pdf/ to Cloudflare R2 and inserts into MongoDB.
 * Run: pnpm tsx scripts/seed.ts
 */

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

if (!R2_ACCOUNT_ID || R2_ACCOUNT_ID === "your-account-id") {
  console.error("❌ R2_ACCOUNT_ID is not set in .env.local");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = "bcube";
const IMGS_DIR = path.resolve(__dirname, "../../imgs");
const PDF_DIR = path.resolve(__dirname, "../../pdf");

// Schemas
const StudySchema = new mongoose.Schema({ year: String, title: String, imagePath: String });
const DesigntonSchema = new mongoose.Schema({ title: String, year: String, participant: String, imagePath: String, pdfPath: String, award: String });
const EtcSchema = new mongoose.Schema({ title: String, year: String, participant: String, imagePath: String, pdfPath: String, award: String });
const SexyItSchema = new mongoose.Schema({ date: Date, title: String, imagePath: String, url: String });
const InterviewSchema = new mongoose.Schema({ name: String, studentId: Number, introduction: String, imagePath: String });
const PhotoSchema = new mongoose.Schema({ description: String, date: Date, imagePath: String });
const ExecutivesSchema = new mongoose.Schema({ name: String, role: String, studentId: Number, imagePath: String });
const ContactSchema = new mongoose.Schema({ email: String, kakaotalkLink: String, instagramLink: String });
const ActivitiesSchema = new mongoose.Schema({ title: String, description: String, imagePath: String, pdfPath: String });

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const types: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".gif": "image/gif",
    ".pdf": "application/pdf",
  };
  return types[ext] || "application/octet-stream";
}

async function upload(filePath: string, folder: string): Promise<string | null> {
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠ File not found: ${path.basename(filePath)}`);
    return null;
  }
  const stat = fs.statSync(filePath);
  const sizeMB = (stat.size / 1024 / 1024).toFixed(1);
  console.log(`  ↑ ${path.basename(filePath)} (${sizeMB}MB)`);

  const fileBuffer = fs.readFileSync(filePath);
  const timestamp = Date.now();
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext).replace(/[^a-zA-Z0-9_-]/g, "");
  const key = `${folder}/${timestamp}-${baseName || "file"}${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: getMimeType(filePath),
    })
  );

  return `${R2_PUBLIC_URL}/${key}`;
}

function img(name: string) { return path.join(IMGS_DIR, name); }
function pdf(name: string) { return path.join(PDF_DIR, name); }

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI, { dbName: "bcube" });
  console.log("Connected!\n");

  // Drop existing collections to start fresh
  const collections = await mongoose.connection.db.listCollections().toArray();
  for (const col of collections) {
    await mongoose.connection.db.dropCollection(col.name);
    console.log(`  Dropped collection: ${col.name}`);
  }
  console.log("");

  const Study = mongoose.model("Study", StudySchema);
  const Designton = mongoose.model("Designton", DesigntonSchema);
  const Etc = mongoose.model("Etc", EtcSchema);
  const SexyIt = mongoose.model("SexyIt", SexyItSchema);
  const Interview = mongoose.model("Interview", InterviewSchema);
  const Photo = mongoose.model("Photo", PhotoSchema);
  const Executives = mongoose.model("Executives", ExecutivesSchema);
  const Contact = mongoose.model("Contact", ContactSchema);
  const Activities = mongoose.model("Activities", ActivitiesSchema);

  // Studies
  console.log("=== Studies ===");
  for (const s of [
    { file: "study-python.svg", year: "2023", title: "Python 스터디" },
    { file: "study-java.svg", year: "2023", title: "Java 스터디" },
    { file: "study-web_develop.png", year: "2024", title: "웹 개발 스터디" },
    { file: "study-causal_inference.svg", year: "2024", title: "인과추론 스터디" },
  ]) {
    const url = await upload(img(s.file), "study");
    if (url) { await Study.create({ year: s.year, title: s.title, imagePath: url }); console.log(`  ✓ ${s.title}`); }
  }

  // Designton
  console.log("\n=== Designton ===");
  for (const d of [
    { img: "designton-2023-team1-Glomeet.png", pdf: "designton-2023-team1-Glomeet.pdf", title: "Glomeet", year: "2023", participant: "Team 1" },
    { img: "designton-2023-team2-아주대 캠퍼스맵.png", pdf: "designton-2023-team2-아주대 캠퍼스맵.pdf", title: "아주대 캠퍼스맵", year: "2023", participant: "Team 2" },
    { img: "designton-2023-team3-치토의 기록집.png", pdf: "designton-2023-team3-치토의 기록집.pdf", title: "치토의 기록집", year: "2023", participant: "Team 3" },
    { img: "designton-2023-team4-AJOUWAY.png", pdf: "designton-2023-team4-AJOUWAY.pdf", title: "AJOUWAY", year: "2023", participant: "Team 4" },
    { img: "designton-2024-team1-치토스.png", pdf: "designton-2024-team1-치토스.pdf", title: "치토스", year: "2024", participant: "Team 1" },
    { img: "designton-2024-team2-아주찌릿.png", pdf: "designton-2024-team2-아주찌릿.pdf", title: "아주찌릿", year: "2024", participant: "Team 2" },
    { img: "designton-2024-team3-Ajou Lab.png", pdf: "designton-2024-team3-Ajou Lab.pdf", title: "Ajou Lab", year: "2024", participant: "Team 3" },
    { img: "designton-2024-team4-DEMATE.png", pdf: "designton-2024-team4-DEMATE.pdf", title: "DEMATE", year: "2024", participant: "Team 4" },
    { img: "designton-2024-team5-A_schedular.png", pdf: "designton-2024-team5-A_schedular.pdf", title: "A_schedular", year: "2024", participant: "Team 5" },
  ]) {
    const imgUrl = await upload(img(d.img), "designton");
    const pdfUrl = await upload(pdf(d.pdf), "designton");
    if (imgUrl) {
      await Designton.create({ title: d.title, year: d.year, participant: d.participant, imagePath: imgUrl, pdfPath: pdfUrl || "" });
      console.log(`  ✓ ${d.title}`);
    }
  }

  // Etc
  console.log("\n=== Etc ===");
  for (const e of [
    { img: "etc-DRIVEL.png", pdf: "etc-DRIVEL.pdf", title: "DRIVEL", year: "2024", participant: "" },
    { img: "etc-shinhan.png", pdf: "etc-shinhan.pdf", title: "신한 빅데이터 해커톤", year: "2024", participant: "" },
    { img: "etc-동행.png", pdf: "etc-동행.pdf", title: "동행", year: "2024", participant: "" },
  ]) {
    const imgUrl = await upload(img(e.img), "etc");
    const pdfUrl = await upload(pdf(e.pdf), "etc");
    if (imgUrl) {
      await Etc.create({ title: e.title, year: e.year, participant: e.participant, imagePath: imgUrl, pdfPath: pdfUrl || "" });
      console.log(`  ✓ ${e.title}`);
    }
  }

  // SexyIt
  console.log("\n=== SexyIt ===");
  for (const s of [
    { file: "sexyit-MS구글.png", title: "MS vs 구글", date: "2024-03-01" },
    { file: "sexyit-X2E.png", title: "X2E", date: "2024-04-01" },
    { file: "sexyit-라이브커머스.png", title: "라이브커머스", date: "2024-05-01" },
    { file: "sexyit-베이비테크.png", title: "베이비테크", date: "2024-06-01" },
    { file: "sexyit-스마트시티.png", title: "스마트시티", date: "2024-07-01" },
    { file: "sexyit-애그테크.png", title: "애그테크", date: "2024-08-01" },
    { file: "sexyit-휴머노드로봇.png", title: "휴머노이드 로봇", date: "2024-09-01" },
  ]) {
    const url = await upload(img(s.file), "sexyit");
    if (url) { await SexyIt.create({ title: s.title, date: new Date(s.date), imagePath: url, url: "https://www.instagram.com/sexyit_season2/" }); console.log(`  ✓ ${s.title}`); }
  }

  // Interview
  console.log("\n=== Interview ===");
  for (const i of [
    { file: "interview-14이준호.jpg", name: "이준호", studentId: 14, intro: "비큐브에서 다양한 IT 경험을 쌓았습니다." },
    { file: "interview-16최재승.jpg", name: "최재승", studentId: 16, intro: "팀 프로젝트를 통해 성장할 수 있었습니다." },
    { file: "interview-17김세형.jpg", name: "김세형", studentId: 17, intro: "비큐브에서의 활동이 취업에 큰 도움이 되었습니다." },
    { file: "interview-17박재형.jpg", name: "박재형", studentId: 17, intro: "기획부터 개발까지 경험할 수 있는 좋은 동아리입니다." },
    { file: "interview-18김혜성.jpg", name: "김혜성", studentId: 18, intro: "함께 성장하는 분위기가 좋았습니다." },
    { file: "interview-18조성주.jpg", name: "조성주", studentId: 18, intro: "실무 경험을 미리 해볼 수 있었습니다." },
    { file: "interview-19주다은.jpg", name: "주다은", studentId: 19, intro: "다양한 분야의 사람들과 협업할 수 있었습니다." },
  ]) {
    const url = await upload(img(i.file), "interview");
    if (url) { await Interview.create({ name: i.name, studentId: i.studentId, introduction: i.intro, imagePath: url }); console.log(`  ✓ ${i.name}`); }
  }

  // Photo
  console.log("\n=== Photo ===");
  for (const p of [
    { file: "photo-2019-학술제 금상.png", desc: "2019 학술제 금상", date: "2019-11-01" },
    { file: "photo-2021-벤처산업 장려상.png", desc: "2021 벤처산업 장려상", date: "2021-11-01" },
    { file: "photo-2021-야생동물 해커톤 은상.png", desc: "2021 야생동물 해커톤 은상", date: "2021-06-01" },
    { file: "photo-2022-학술제 은상.png", desc: "2022 학술제 은상", date: "2022-11-01" },
    { file: "photo-2023-스터디 결과보고회.jpg", desc: "2023 스터디 결과보고회", date: "2023-06-01" },
    { file: "photo-2023-파란학기 황금실패상(2등).jpg", desc: "2023 파란학기 황금실패상", date: "2023-12-01" },
    { file: "photo-2023-학술제 대상.jpg", desc: "2023 학술제 대상", date: "2023-11-01" },
    { file: "photo-2024-자바스터디.jpg", desc: "2024 자바스터디", date: "2024-06-01" },
    { file: "photo-2024-학술제 대상.jpeg", desc: "2024 학술제 대상", date: "2024-11-01" },
  ]) {
    const url = await upload(img(p.file), "photo");
    if (url) { await Photo.create({ description: p.desc, date: new Date(p.date), imagePath: url }); console.log(`  ✓ ${p.desc}`); }
  }

  // Executives
  console.log("\n=== Executives ===");
  const execUrl = await upload(img("executives-chulhwa.webp"), "executives");
  if (execUrl) { await Executives.create({ name: "철화", role: "회장", studentId: 20, imagePath: execUrl }); console.log(`  ✓ 철화`); }

  // Activities (메인 페이지 프로젝트 캐러셀 - designton + etc에서 선별)
  console.log("\n=== Activities ===");
  for (const a of [
    { img: "designton-2023-team1-Glomeet.png", pdf: "designton-2023-team1-Glomeet.pdf", title: "Glomeet", desc: "2023 디자인톤 Team 1" },
    { img: "designton-2023-team4-AJOUWAY.png", pdf: "designton-2023-team4-AJOUWAY.pdf", title: "AJOUWAY", desc: "2023 디자인톤 Team 4" },
    { img: "designton-2024-team3-Ajou Lab.png", pdf: "designton-2024-team3-Ajou Lab.pdf", title: "Ajou Lab", desc: "2024 디자인톤 Team 3" },
    { img: "designton-2024-team4-DEMATE.png", pdf: "designton-2024-team4-DEMATE.pdf", title: "DEMATE", desc: "2024 디자인톤 Team 4" },
    { img: "designton-2024-team5-A_schedular.png", pdf: "designton-2024-team5-A_schedular.pdf", title: "A_schedular", desc: "2024 디자인톤 Team 5" },
    { img: "etc-DRIVEL.png", pdf: "etc-DRIVEL.pdf", title: "DRIVEL", desc: "2024 외부 프로젝트" },
    { img: "etc-shinhan.png", pdf: "etc-shinhan.pdf", title: "신한 빅데이터 해커톤", desc: "2024 외부 대회" },
  ]) {
    const imgUrl = await upload(img(a.img), "activities");
    const pdfUrl = await upload(pdf(a.pdf), "activities");
    if (imgUrl && pdfUrl) {
      await Activities.create({ title: a.title, description: a.desc, imagePath: imgUrl, pdfPath: pdfUrl });
      console.log(`  ✓ ${a.title}`);
    }
  }

  // Contact
  console.log("\n=== Contact ===");
  await Contact.create({ email: "bcube.ajou@gmail.com", kakaotalkLink: "https://open.kakao.com/o/sCRuhWTg", instagramLink: "https://www.instagram.com/sexyit_season2/" });
  console.log(`  ✓ Contact info`);

  console.log("\n✅ Seed completed!");
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
