/**
 * Role 변환 유틸리티
 */

export type RoleType = "PRINCIPAL" | "TEACHER" | "STUDENT" | "ADMIN";

const ROLE_MAP: Record<RoleType, string> = {
  PRINCIPAL: "원장",
  TEACHER: "선생님",
  STUDENT: "학생",
  ADMIN: "관리자",
};

const KOREAN_TO_ROLE: Record<string, RoleType> = {
  원장: "PRINCIPAL",
  선생님: "TEACHER",
  학생: "STUDENT",
  관리자: "ADMIN",
};

/** 영문 role을 한글로 변환 */
export const roleToKorean = (role?: string): string => {
  if (!role) return "-";
  return ROLE_MAP[role as RoleType] ?? role;
};

/** 한글 role을 영문으로 변환 */
export const koreanToRole = (korean: string): RoleType | null => {
  return KOREAN_TO_ROLE[korean] ?? null;
};
