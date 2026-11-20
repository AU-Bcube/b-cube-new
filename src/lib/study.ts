import type { Study } from "@/types";

type StudyDetails = Omit<Study, "id" | "year" | "title" | "imagePath">;

// 관리자 폼의 상세 칸. 글자 칸은 그대로, 목록 칸은 구분자로 나눠 배열로 저장한다.
const TEXT_FIELDS = ["summary", "period", "schedule", "level", "tools", "notionUrl"] as const;
const LIST_FIELDS = { members: ",", outcomes: "\n", curriculum: "\n" } as const;

// 폼(FormData 또는 JSON)에 들어 있는 상세 칸만 읽는다. 비운 글자 칸은 undefined가 되어 지워진다.
export function readStudyDetails(
  has: (key: string) => boolean,
  get: (key: string) => unknown
): StudyDetails {
  const details: StudyDetails = {};
  for (const key of TEXT_FIELDS) {
    if (has(key)) details[key] = String(get(key) ?? "").trim() || undefined;
  }
  for (const [key, separator] of Object.entries(LIST_FIELDS) as [keyof typeof LIST_FIELDS, string][]) {
    if (has(key)) {
      const raw = get(key);
      details[key] = typeof raw === "string"
        ? raw.split(separator).map((s) => s.trim()).filter(Boolean)
        : [];
    }
  }
  return details;
}

// DB 문서를 화면에 넘기는 모양으로 바꾼다 (getStudies와 GET /api/study가 같이 쓴다).
export function toStudy(s: Record<string, unknown> & { _id: unknown }): Study {
  return {
    id: String(s._id),
    year: s.year as string,
    title: s.title as string,
    imagePath: s.imagePath as string,
    summary: s.summary as string | undefined,
    period: s.period as string | undefined,
    schedule: s.schedule as string | undefined,
    level: s.level as string | undefined,
    members: (s.members as string[] | undefined) ?? [],
    tools: s.tools as string | undefined,
    outcomes: (s.outcomes as string[] | undefined) ?? [],
    curriculum: (s.curriculum as string[] | undefined) ?? [],
    notionUrl: s.notionUrl as string | undefined,
  };
}
