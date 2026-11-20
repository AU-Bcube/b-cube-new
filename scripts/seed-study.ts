/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Seed script: fills the study detail fields (#53) into the existing studies documents.
 * - Source: 기획팀 스터디 정리 파일 (2026-11-19). Line breaks inside a sentence are joined.
 * - Matches documents by their current DB title. Never creates or deletes documents.
 * - Only fills fields that are empty, so edits made in the admin page are kept.
 * - "Java/Spring 스터디" (2023) has no data and keeps the plain card.
 * - Dry run by default. Add --write to save.
 * Run: pnpm tsx scripts/seed-study.ts [--write]
 */

const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const WRITE = process.argv.includes("--write");

const StudySchema = new mongoose.Schema({
  title: String,
  summary: String,
  period: String,
  schedule: String,
  level: String,
  members: [String],
  tools: String,
  outcomes: [String],
  curriculum: [String],
});

const STUDIES = [
  {
    title: "웹 개발 스터디",
    summary: "VS Code로 직접 코딩해 나만의 웹페이지 만들기",
    period: "2024-1, 2024-2",
    schedule: "스터디 부원들의 투표를 통해 유동적으로 조율",
    level: "입문자, 비전공자 가능",
    members: ["강지훈", "김민채", "석지민", "이서연", "임진영"],
    tools: "VS Code, GitHub",
    outcomes: ["HTML, CSS, JS 기본 문법 익히기", "컴포넌트 단위로 화면 직접 코딩하기", "나만의 CRUD 게시판 만들기"],
    curriculum: ["VS Code, GitHub 사용법 익히기", "HTML, CSS로 페이지 구성하기", "JS로 동작 붙이기", "스톱워치 만들기", "CRUD 게시판 만들기"],
  },
  {
    title: "인과추론 스터디",
    summary: "데이터 속 상관관계를 넘어 원인을 탐색하기",
    period: "2025-1",
    schedule: "매주 화 18:00 / 대면",
    level: "누구나 가능",
    members: ["한철화", "강현우", "곽성우", "김민채", "김수환", "김준영", "성하솔", "이우석", "이서연", "이정은", "최승연", "추푸름"],
    tools: "Python",
    outcomes: ["상관관계와 인과관계를 구분하는 데이터 해석력", "Python으로 인과추론 핵심 기법 실습"],
    curriculum: ["인과추론 개념과 필요성 이해", "교재 기반 기초 스터디", "주제별 세미나 발표 및 토론"],
  },
  {
    title: "기업 분석 스터디",
    summary: "질문을 바탕으로 기업을 읽는 눈 기르기",
    period: "2026-2",
    schedule: "매주 목 18:00 / 대면",
    level: "누구나 가능",
    members: ["성하솔", "김규리", "김민준", "배주연", "안율이", "이성원"],
    tools: "자체 분석 프레임",
    outcomes: ["DART/IR 자료로 회사가 돈 버는 구조 읽기", "최신 이슈 바탕 기업 흐름 파악 및 해석", "같은 산업 내 다양한 기업 비교 분석"],
    curriculum: ["분석 템플릿 구조 파악", "산업 브리핑을 통한 관심 산업 선정", "기업 분석 글 작성 및 피드백", "Velog에 글 업로드 및 카드뉴스 제작"],
  },
  {
    title: "Figma 스터디",
    summary: "피그마의 기초를 학습하고 나만의 UI 만들기",
    period: "2026-1, 2026-2",
    schedule: "스터디 부원들의 투표를 통해 유동적으로 조율",
    level: "입문자, 비전공자 가능",
    members: ["김민채", "이성원", "유도희", "강혜리", "김민준", "김세연", "김효민", "오효주", "정윤지"],
    tools: "피그마, 노션",
    outcomes: ["기초 툴 다루기(피그마 인터페이스 적응)", "프로토타입 제작하는 법", "피그마 make로 나만의 UI/UX 만들기"],
    curriculum: [
      "UI 디자인 기초-기본 기능",
      "일관성/위계 이론 학습",
      "베리어블과 스타일 적용 및 셀렉션 컬러 학습",
      "컴포넌트/스마트 셀렉션/오토레이아웃 학습",
      "프로토타입 이론 및 실전",
      "피그마 make를 사용한 나만의 서비스 제작",
    ],
  },
  {
    title: "프롬프트 엔지니어링 스터디",
    summary: "기법을 배우고 실습하며 AI에게 일 잘 시키는 법 익히기",
    period: "2026-1",
    schedule: "매주 수 14:00 / 대면",
    level: "누구나 가능",
    members: ["성하솔", "박성서", "안율이", "정승호", "현다연"],
    tools: "ChatGPT, Claude, Gemini",
    outcomes: ["상황에 맞는 프롬프트 기법 골라 쓰기", "AI 오답 원인을 찾아 프롬프트 개선하기", "프롬프트 기법을 적용한 AI 서비스 기획·구현"],
    curriculum: ["프롬프트 기본 개념과 LLM 설정 이해", "기법별 발제 및 일상 문제 실습 (CoT, RAG 등)", "기법별 비즈니스 활용 사례 조사", "프롬프트 기법 활용 AI 서비스 프로젝트"],
  },
  {
    title: "Python 스터디",
    summary: "파이썬 기초 문법부터 차근차근 익히기",
    period: "2023-1",
    schedule: "매주 월 15:00 / 대면",
    level: "입문자, 비전공자 가능",
    members: ["김혜성", "성하솔", "이우석", "조우진"],
    tools: "Python",
    outcomes: ["변수/자료형/조건문/반복문 등 기초 문법 익히기", "함수와 자료구조로 코드 짜기", "파이썬다운 깔끔한 코드 작성하기"],
    curriculum: ["프로그래밍 언어와 파이썬 이해", "변수/자료형, 화면 입출력과 리스트", "조건문/반복문, 함수", "문자열과 자료구조", "파이썬 스타일 코드"],
  },
  {
    title: "JAVA 스터디",
    summary: "자바 문법을 넘어 객체지향 개념을 실전에 적용하기",
    period: "2026-1",
    schedule: "매주 수 18:00 / 대면",
    level: "초급~중급, 수준별 그룹 운영",
    members: ["김소정", "배주연", "오효주", "이성재", "조현익"],
    tools: "IntelliJ IDEA, JDK 21",
    outcomes: ["자바 기본 문법 익히기", "클래스와 객체 개념 이해하기", "객체지향 설계를 실습 프로젝트에 적용하기"],
    curriculum: ["수준별 자바 기본 문법 (신입생·재학생 그룹)", "클래스와 객체 개념 학습", "객체지향 개념 실전 활용 실습 (통합)"],
  },
  {
    title: "바이브 코딩 스터디",
    summary: "AI와 함께 코딩해 내 업무를 자동화하는 앱 만들기",
    period: "2026-1, 2026-2",
    schedule: "매주 목 15:00 / 대면",
    level: "입문자, 비전공자 가능",
    members: ["권혁찬", "김규리", "김세연", "배주연", "성하솔", "오효주", "윤서준", "정윤지", "조현익", "허준표"],
    tools: "Cursor, TypeScript, JavaScript, 다양한 AI 활용",
    outcomes: ["JavaScript, TypeScript 기초 익히기", "AI 코딩 툴로 원하는 기능 구현하기", "내 업무를 자동화하는 앱 직접 만들기"],
    curriculum: ["JavaScript, TypeScript 기초", "AI 코딩 툴 사용법과 활용", "업무 자동화 아이디어 기획", "나만의 자동화 앱 제작"],
  },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!, { dbName: "bcube" });
  const Study = mongoose.model("Study", StudySchema);

  let changed = 0;
  for (const { title, ...fields } of STUDIES) {
    const doc = await Study.findOne({ title });
    if (!doc) {
      console.log(`  ✗ ${title}: DB에 없음`);
      continue;
    }

    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      const current = doc[key];
      if (Array.isArray(current) ? current.length === 0 : !current) updates[key] = value;
    }

    const keys = Object.keys(updates);
    if (keys.length === 0) {
      console.log(`  - ${title}: 이미 채워져 있음`);
      continue;
    }
    changed++;
    console.log(`  ✓ ${title}: ${keys.join(", ")}`);
    if (WRITE) await Study.updateOne({ _id: doc._id }, { $set: updates });
  }

  console.log(WRITE ? `\n${changed}건 저장함` : `\n${changed}건 바뀔 예정 (저장하려면 --write)`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });

export {};
