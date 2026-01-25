import { CountryCode, LanguageTestType, RegionEnumExtend, type TestScoreInfo } from "@/types/university";

export const REGIONS_SEARCH = ["유럽권", "미주권", "아시아권"] as const;

export const REGIONS_KO = ["유럽권", "미주권", "아시아권", "중국권"];

export const COUNTRIES_KO = [
  // 2024-2 기준
  // 아시아권
  "말레이시아",
  "브루나이",
  "싱가포르",
  "아제르바이잔",
  "인도네시아",
  "일본",
  "키르기스스탄",
  "튀르키예",
  "홍콩",
  "카자흐스탄",
  "이스라엘",
  "말레이시아",
  // 미주권
  "미국",
  "캐나다",
  "호주",
  "브라질",
  // 유럽권
  "네덜란드",
  "노르웨이",
  "덴마크",
  "독일",
  "리투아니아",
  "리히텐슈타인",
  "스웨덴",
  "스위스",
  "스페인",
  "오스트리아",
  "체코",
  "포르투갈",
  "폴란드",
  "프랑스",
  "핀란드",
  "러시아",
  // 중국권
  "중국",
  "대만",
];

/**
 * LanguageTestType Enum에 대한 한글 이름 맵.
 * UI 필터링 옵션 등을 만들 때 유용합니다.
 */
export const LANGUAGE_TEST_TYPE_MAP: Record<LanguageTestType, string> = {
  [LanguageTestType.CEFR]: "유럽 공통 언어 능력 (CEFR)",
  [LanguageTestType.JLPT]: "일본어 능력 시험 (JLPT)",
  [LanguageTestType.DALF]: "프랑스 고급 프랑스어 자격증 (DALF)",
  [LanguageTestType.DELF]: "프랑스 기초·중급 프랑스어 자격증 (DELF)",
  [LanguageTestType.DUOLINGO]: "듀오링고 온라인 영어 시험",
  [LanguageTestType.IELTS]: "국제 영어 시험 (IELTS)",
  [LanguageTestType.NEW_HSK]: "중국어 능력 시험 (NEW_HSK)",
  [LanguageTestType.TCF]: "프랑스어 지식 시험 (TCF)",
  [LanguageTestType.TEF]: "프랑스어 평가 시험 (TEF)",
  [LanguageTestType.TOEFL_IBT]: "인터넷 기반 영어 시험 (TOEFL iBT)",
  [LanguageTestType.TOEFL_ITP]: "기관용 TOEFL (TOEFL ITP)",
  [LanguageTestType.TOEIC]: "비즈니스 영어 (TOEIC)",
};

export const COUNTRY_CODE_MAP: Record<CountryCode, string> = {
  [CountryCode.AT]: "오스트리아",
  [CountryCode.AU]: "호주",
  [CountryCode.AZ]: "아제르바이잔",
  [CountryCode.BE]: "벨기에",
  [CountryCode.BN]: "브루나이",
  [CountryCode.BR]: "브라질",
  [CountryCode.CA]: "캐나다",
  [CountryCode.CH]: "스위스",
  [CountryCode.CN]: "중국",
  [CountryCode.CZ]: "체코",
  [CountryCode.DE]: "독일",
  [CountryCode.DK]: "덴마크",
  [CountryCode.ES]: "스페인",
  [CountryCode.FI]: "핀란드",
  [CountryCode.FR]: "프랑스",
  [CountryCode.GB]: "영국",
  [CountryCode.GE]: "조지아",
  [CountryCode.HK]: "홍콩",
  [CountryCode.HU]: "헝가리",
  [CountryCode.ID]: "인도네시아",
  [CountryCode.IL]: "이스라엘",
  [CountryCode.IT]: "이탈리아",
  [CountryCode.JP]: "일본",
  [CountryCode.KG]: "키르기스스탄",
  [CountryCode.KZ]: "카자흐스탄",
  [CountryCode.LT]: "리투아니아",
  [CountryCode.MY]: "말레이시아",
  [CountryCode.NL]: "네덜란드",
  [CountryCode.NO]: "노르웨이",
  [CountryCode.PL]: "폴란드",
  [CountryCode.PT]: "포르투갈",
  [CountryCode.RU]: "러시아",
  [CountryCode.SE]: "스웨덴",
  [CountryCode.SG]: "싱가포르",
  [CountryCode.TH]: "태국",
  [CountryCode.TR]: "튀르키예",
  [CountryCode.TW]: "대만",
  [CountryCode.US]: "미국",
  [CountryCode.UZ]: "우즈베키스탄",
};

// --- 데이터 구조화 (이전 답변과 동일) ---

export const REGION_KO_MAP: Record<RegionEnumExtend, string> = {
  [RegionEnumExtend.AMERICAS]: "미주권",
  [RegionEnumExtend.EUROPE]: "유럽권",
  [RegionEnumExtend.ASIA]: "아시아권",
  [RegionEnumExtend.CHINA]: "중국권",
  [RegionEnumExtend.ALL]: "전체", // 'ALL'은 특별 케이스로 처리
};

const regionCountryMap: Record<RegionEnumExtend, string[]> = {
  [RegionEnumExtend.ALL]: [],
  [RegionEnumExtend.EUROPE]: [
    "GB",
    "DE",
    "FR",
    "IT",
    "ES",
    "NL",
    "SE",
    "NO",
    "DK",
    "FI",
    "IE",
    "AT",
    "CH",
    "BE",
    "PL",
    "CZ",
    "HU",
  ],
  [RegionEnumExtend.AMERICAS]: ["US", "CA", "MX", "BR", "AR", "CL", "CO", "PE"],
  [RegionEnumExtend.ASIA]: ["JP", "KR", "SG", "MY", "TH", "IN", "ID", "PH", "VN"],
  [RegionEnumExtend.CHINA]: ["CN", "HK", "TW", "MO"],
};

export const REGION_TO_COUNTRY_CODE_MAP: Record<RegionEnumExtend, string[]> = {
  [RegionEnumExtend.AMERICAS]: regionCountryMap[RegionEnumExtend.AMERICAS],
  [RegionEnumExtend.EUROPE]: regionCountryMap[RegionEnumExtend.EUROPE],
  [RegionEnumExtend.ASIA]: regionCountryMap[RegionEnumExtend.ASIA],
  [RegionEnumExtend.CHINA]: regionCountryMap[RegionEnumExtend.CHINA],
  [RegionEnumExtend.ALL]: [], // 'ALL'은 특별 케이스로 처리
};

export const REGION_TO_COUNTRIES_MAP: Record<string, string[]> = {
  미주권: ["미국", "캐나다", "호주", "브라질"],
  유럽권: [
    "네덜란드",
    "노르웨이",
    "덴마크",
    "독일",
    "리투아니아",
    "스웨덴",
    "스위스",
    "스페인",
    "오스트리아",
    "체코",
    "포르투갈",
    "폴란드",
    "프랑스",
    "핀란드",
    "러시아",
  ],
  아시아권: [
    "말레이시아",
    "브루나이",
    "싱가포르",
    "아제르바이잔",
    "인도네시아",
    "일본",
    "키르기스스탄",
    "튀르키예",
    "홍콩",
    "카자흐스탄",
    "이스라엘",
  ],
  중국권: ["중국", "대만"],
};

/**
 * 각 언어 시험별 점수 규칙을 정의한 상수 객체.
 * 유효성 검사나 UI 생성에 활용할 수 있습니다.
 */
export const TEST_SCORE_INFO: Record<LanguageTestType, TestScoreInfo> = {
  [LanguageTestType.CEFR]: {
    name: "유럽 공통 언어 능력 (CEFR)",
    type: "level",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
  [LanguageTestType.JLPT]: {
    name: "일본어 능력 시험 (JLPT)",
    type: "level",
    levels: ["N5", "N4", "N3", "N2", "N1"],
  },
  [LanguageTestType.DALF]: {
    name: "프랑스 고급 프랑스어 자격증 (DALF)",
    type: "level",
    levels: ["C1", "C2"],
  },
  [LanguageTestType.DELF]: {
    name: "프랑스 기초·중급 프랑스어 자격증 (DELF)",
    type: "level",
    levels: ["A1", "A2", "B1", "B2"],
  },
  [LanguageTestType.DUOLINGO]: {
    name: "듀오링고 온라인 영어 시험",
    type: "numeric",
    min: 10,
    max: 160,
  },
  [LanguageTestType.IELTS]: {
    name: "국제 영어 시험 (IELTS)",
    type: "numeric",
    min: 0.0,
    max: 9.0,
  },
  [LanguageTestType.NEW_HSK]: {
    name: "중국어 능력 시험 (NEW_HSK)",
    type: "numeric",
    min: 1,
    max: 9,
  },
  [LanguageTestType.TCF]: {
    name: "프랑스어 지식 시험 (TCF)",
    type: "numeric",
    min: 100,
    max: 699,
  },
  [LanguageTestType.TEF]: {
    name: "프랑스어 평가 시험 (TEF)",
    type: "numeric",
    min: 0,
    max: 900,
  },
  [LanguageTestType.TOEFL_IBT]: {
    name: "인터넷 기반 영어 시험 (TOEFL iBT)",
    type: "numeric",
    min: 0,
    max: 120,
  },
  [LanguageTestType.TOEFL_ITP]: {
    name: "기관용 TOEFL (TOEFL ITP)",
    type: "numeric",
    min: 310,
    max: 677,
  },
  [LanguageTestType.TOEIC]: {
    name: "비즈니스 영어 (TOEIC)",
    type: "numeric",
    min: 10,
    max: 990,
  },
};
