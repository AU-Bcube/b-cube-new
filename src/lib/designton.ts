import type { DesigntonMember } from "@/types";

// 관리자 폼이 숨은 입력칸 하나에 JSON 문자열로 보내는 팀원 목록을 배열로 바꾼다.
// 이름이 빈 줄은 버리고, 역할이 비어 있으면 role을 저장하지 않는다.
export function parseMembers(raw: unknown): DesigntonMember[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  let list: unknown;
  try {
    list = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(list)) return [];
  return list
    .map((m) => ({
      name: String(m?.name ?? "").trim(),
      role: String(m?.role ?? "").trim(),
    }))
    .filter((m) => m.name)
    .map((m) => (m.role ? m : { name: m.name }));
}

export const REQUIRED_TEXT_FIELDS = {
  title: "제목",
  year: "연도",
  summary: "한 줄 설명",
  type: "형태",
  description: "프로젝트 설명",
} as const;

export const OPTIONAL_TEXT_FIELDS = ["period", "award", "link"] as const;
