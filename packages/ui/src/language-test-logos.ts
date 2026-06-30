export const DEFAULT_LANGUAGE_TEST_LOGO_SRC = "/images/language/default.png";

export const languageTestLogoMap = {
  TOEIC: "/images/language/toeic.png",
  TOEFL_IBT: "/images/language/toefl_ibt.png",
  TOEFL_ITP: "/images/language/toefl_itp.png",
  IELTS: "/images/language/ielts.png",
  JLPT: "/images/language/jlpt.png",
  NEW_HSK: "/images/language/new_hsk.png",
  ETC: "/images/language/etc.png",
  DALF: "/images/language/dalf.png",
  DELF: "/images/language/delf.jpg",
  CEFR: "/images/language/cefr.png",
  TCF: "/images/language/tcf.png",
  TEF: "/images/language/tef.png",
  DUOLINGO: "/images/language/duolingo.svg",
} as const;

export type LanguageTestLogoType = keyof typeof languageTestLogoMap;

export const getLanguageTestLogo = (type: string): string => {
  return type in languageTestLogoMap
    ? languageTestLogoMap[type as LanguageTestLogoType]
    : DEFAULT_LANGUAGE_TEST_LOGO_SRC;
};

export const formatLanguageTestName = (type: string): string => {
  return type.replace(/_/g, " ");
};
