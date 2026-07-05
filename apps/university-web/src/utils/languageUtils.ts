const LANGUAGE_TEST_LOGO_BASE_PATH = "/university-static/images/language";

export const DEFAULT_LANGUAGE_TEST_LOGO_SRC = `${LANGUAGE_TEST_LOGO_BASE_PATH}/default.png`;

export const logoMap = {
  TOEIC: `${LANGUAGE_TEST_LOGO_BASE_PATH}/toeic.png`,
  TOEFL_IBT: `${LANGUAGE_TEST_LOGO_BASE_PATH}/toefl_ibt.png`,
  TOEFL_ITP: `${LANGUAGE_TEST_LOGO_BASE_PATH}/toefl_itp.png`,
  IELTS: `${LANGUAGE_TEST_LOGO_BASE_PATH}/ielts.png`,
  JLPT: `${LANGUAGE_TEST_LOGO_BASE_PATH}/jlpt.png`,
  NEW_HSK: `${LANGUAGE_TEST_LOGO_BASE_PATH}/new_hsk.png`,
  ETC: `${LANGUAGE_TEST_LOGO_BASE_PATH}/etc.png`,
  DALF: `${LANGUAGE_TEST_LOGO_BASE_PATH}/dalf.png`,
  DELF: `${LANGUAGE_TEST_LOGO_BASE_PATH}/delf.jpg`,
  CEFR: `${LANGUAGE_TEST_LOGO_BASE_PATH}/cefr.png`,
  TCF: `${LANGUAGE_TEST_LOGO_BASE_PATH}/tcf.png`,
  TEF: `${LANGUAGE_TEST_LOGO_BASE_PATH}/tef.png`,
  DUOLINGO: `${LANGUAGE_TEST_LOGO_BASE_PATH}/duolingo.svg`,
} as const;

type LanguageTestLogoType = keyof typeof logoMap;

const languageTestLogoAliases: Record<string, LanguageTestLogoType> = {
  HSK: "NEW_HSK",
  DUOLINGO_ENGLISH_TEST: "DUOLINGO",
};

const normalizeLanguageTestLogoType = (type: string): LanguageTestLogoType | undefined => {
  const normalizedType = type
    .trim()
    .toUpperCase()
    .replace(/[./]/g, "")
    .replace(/[\s-]+/g, "_");
  const logoType = languageTestLogoAliases[normalizedType] ?? normalizedType;

  return logoType in logoMap ? (logoType as LanguageTestLogoType) : undefined;
};

export const getLanguageTestLogo = (type: string): string => {
  const logoType = normalizeLanguageTestLogoType(type);

  return logoType ? logoMap[logoType] : DEFAULT_LANGUAGE_TEST_LOGO_SRC;
};

export const formatLanguageTestName = (type: string): string => {
  return type.trim().replace(/_/g, " ");
};
