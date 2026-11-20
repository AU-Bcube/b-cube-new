import type { DesigntonMember } from "@/types";

// 관리자 폼의 참여자 칸(쉼표로 구분)을 팀원 목록으로 바꾼다. 빈 이름은 버린다.
export function parseMembers(raw: unknown): DesigntonMember[] {
  if (typeof raw !== "string") return [];
  return raw
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({ name }));
}

export const REQUIRED_TEXT_FIELDS = {
  title: "제목",
  year: "연도",
  summary: "한 줄 설명",
  description: "프로젝트 요약",
} as const;

export const OPTIONAL_TEXT_FIELDS = ["period", "award"] as const;
