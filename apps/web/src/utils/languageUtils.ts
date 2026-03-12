// 시험 종류별 로고 URL 맵
export const logoMap: Record<string, string> = {
  TOEIC: "/images/language/toeic.png",
  TOEFL_IBT: "/images/language/toefl_ibt.png",
  TOEFL_ITP: "/images/language/toefl_itp.png",
  IELTS: "/images/language/ielts.png",
};

export const getLanguageTestLogo = (type: string): string => {
  return logoMap[type] || "/images/language/default.png";
};

// UNDER_SCORE → "UNDER SCORE" 처리를 위한 헬퍼
export function formatLanguageTestName(type: string): string {
  return type.replace(/_/g, " ");
}
