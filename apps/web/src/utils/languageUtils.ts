import { LanguageTestEnum } from "@/types/score";

const defaultLanguageTestLogo = "/images/language/default.png";

// 시험 종류별 로고 URL 맵
export const logoMap = {
  [LanguageTestEnum.TOEIC]: "/images/language/toeic.png",
  [LanguageTestEnum.TOEFL_IBT]: "/images/language/toefl_ibt.png",
  [LanguageTestEnum.TOEFL_ITP]: "/images/language/toefl_itp.png",
  [LanguageTestEnum.IELTS]: "/images/language/ielts.png",
  [LanguageTestEnum.JLPT]: "/images/language/jlpt.png",
  [LanguageTestEnum.NEW_HSK]: "/images/language/new_hsk.png",
  [LanguageTestEnum.ETC]: "/images/language/etc.png",
  [LanguageTestEnum.DALF]: "/images/language/dalf.png",
  [LanguageTestEnum.CEFR]: "/images/language/cefr.png",
  [LanguageTestEnum.TCF]: "/images/language/tcf.png",
  [LanguageTestEnum.TEF]: "/images/language/tef.png",
  [LanguageTestEnum.DUOLINGO]: "/images/language/duolingo.svg",
} satisfies Record<LanguageTestEnum, string>;

export const getLanguageTestLogo = (type: string): string => {
  return type in logoMap ? logoMap[type as LanguageTestEnum] : defaultLanguageTestLogo;
};

// UNDER_SCORE → "UNDER SCORE" 처리를 위한 헬퍼
export function formatLanguageTestName(type: string): string {
  return type.replace(/_/g, " ");
}
