/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Seed script: inserts the recruiting FAQ (docs/리크루팅_FAQ_추가.md) into MongoDB.
 * Skips when the faqs collection already has documents.
 * Run: pnpm tsx scripts/seed-faq.ts
 */

const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;

const FaqSchema = new mongoose.Schema({ category: String, question: String, answer: String });

const FAQS = [
  {
    category: "지원",
    question: "누가 지원할 수 있나요?",
    answer: "아주대학교 경영대 소속 학과생이라면 학년 제한 없이 누구나 지원 가능합니다.",
  },
  {
    category: "지원",
    question: "개발 경험이 전혀 없어도 괜찮나요?",
    answer: "네, 괜찮습니다. 비큐브에서는 기획/디자인 등의 비개발 파트도 있고, 부족한 개발 역량을 높여주는 스터디가 있으므로, 부족함에 대한 걱정보다는 배우겠다는 마음가짐이 중요합니다.",
  },
  {
    category: "지원",
    question: "지원서의 'IT 관련 경험'은 뭘 적어야 하나요?",
    answer: "IT 관련 프로젝트 경험, 혹은 코딩 경험이 들어갈 수 있습니다. 다만 '화면을 만들어봤다' 수준보다는 어떤 문제를 어떻게 해결했는지를 구체적으로 작성하는 것을 권장드립니다. 이외에도 IT 자료 정리, 트렌드 분석, 관련 툴 활용 경험 등 IT에 대한 관심을 확인할 수 있는 활동이라면 무엇이든 괜찮습니다.",
  },
  {
    category: "지원",
    question: "모집 시기는 언제인가요?",
    answer: "비큐브는 매 학기 초에 신입 부원을 모집합니다. 다만 당해년도 상황에 따라 2학기는 모집을 진행하지 않을 수 있으며, 구체적인 일정은 홈페이지 리크루팅 탭과 비큐브 공식 인스타그램(@bcube_ajou)을 참고 바랍니다.",
  },
  {
    category: "선발",
    question: "전형 절차와 면접은 어떻게 진행되나요?",
    answer: "서류 지원 → 대면 면접 순으로 진행되며, 자세한 일정은 모집 공고에서 확인 가능합니다. 면접에서는 제출한 지원서를 바탕으로 IT 및 협업 역량, 열정 및 태도, 조직 관심도 등에 관해 질문드립니다.",
  },
  {
    category: "선발",
    question: "선발할 때 가장 중요하게 보는 건 무엇인가요?",
    answer: "활동에 얼마나 적극적으로 임할 수 있는지, 그 의지를 가장 중요하게 봅니다. 이미 충분한 역량을 갖춘 사람뿐만 아니라, 아직 부족하더라도 비큐브에 들어와 열심히 참여하며 많은 것을 얻어 가고자 하는 분을 찾고 있습니다.",
  },
  {
    category: "선발",
    question: "떨어져도 재지원할 수 있나요?",
    answer: "네. 재지원 가능하며, 이전 기수 결과는 다음 기수 평가에 전혀 영향을 주지 않습니다.",
  },
  {
    category: "활동",
    question: "어떤 활동을 하고, 활동은 어떻게 정해지나요?",
    answer: "서비스를 직접 기획하고 디자인/개발 과정까지도 진행합니다. 이외에도 '섹시한 IT' 카드뉴스 발행, 웹사이트 운영, 신입생 대상 아이디어톤, 스터디 등 다양한 활동이 준비되어 있으며, 최종 합격 후 제공되는 활동 조사 폼을 통해 원하는 활동을 자유롭게 신청할 수 있습니다.",
  },
  {
    category: "활동",
    question: "활동 시간 부담은 어느 정도인가요?",
    answer: "학회 공식 정기 일정은 개강총회와 종강총회입니다. 이외에는 본인의 선택 활동에 따라 활동 시간이 달라집니다. 다만 적어도 주 1회 정도 활동 집중 시간을 마련하는 것을 권장드립니다. 또한 졸업생 초청 특강이나 큐브콘 등 다양한 행사가 있으며, 이는 선택 참여입니다.",
  },
  {
    category: "활동",
    question: "회비가 있나요?",
    answer: "비큐브는 별도의 회비를 받지 않습니다. 다만 일부 활동은 참여 여부에 따라 비용이 발생할 수 있으며, 이 경우 사전에 안내드립니다.",
  },
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  const Faq = mongoose.models.Faq || mongoose.model("Faq", FaqSchema);

  const count = await Faq.countDocuments();
  if (count > 0) {
    console.log(`faqs already has ${count} documents, skipping`);
  } else {
    // insert one by one so _id order matches the FAQ order
    for (const faq of FAQS) {
      await Faq.create(faq);
      console.log(`  ✓ [${faq.category}] ${faq.question}`);
    }
  }

  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });

export {};
