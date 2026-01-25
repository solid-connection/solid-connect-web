export type RegionKo = "유럽권" | "미주권" | "아시아권";

/**
 * 홈 대학교 이름 (협정 대학)
 */
export enum HomeUniversityName {
  INHA = "인하대학교",
  INCHEON = "인천대학교",
  SUNGSHIN = "성신여자대학교",
}

/**
 * 홈 대학교 URL 슬러그 매핑
 */
export const HOME_UNIVERSITY_SLUG: Record<string, HomeUniversityName> = {
  inha: HomeUniversityName.INHA,
  incheon: HomeUniversityName.INCHEON,
  sungshin: HomeUniversityName.SUNGSHIN,
};

/**
 * 홈 대학교 이름에서 슬러그로 매핑
 */
export const HOME_UNIVERSITY_TO_SLUG: Record<HomeUniversityName, string> = {
  [HomeUniversityName.INHA]: "inha",
  [HomeUniversityName.INCHEON]: "incheon",
  [HomeUniversityName.SUNGSHIN]: "sungshin",
};

/**
 * 홈 대학교 정보 (이미지, 설명 등)
 */
export interface HomeUniversityInfo {
  name: HomeUniversityName;
  slug: string;
  imageUrl: string;
  description: string;
}

export const HOME_UNIVERSITIES: HomeUniversityInfo[] = [
  {
    name: HomeUniversityName.INHA,
    slug: "inha",
    imageUrl: "/images/unvis/inha.png",
    description: "인하대학교 파견 교환학생 정보",
  },
  {
    name: HomeUniversityName.INCHEON,
    slug: "incheon",
    imageUrl: "/images/unvis/incheon.png",
    description: "인천대학교 파견 교환학생 정보",
  },
  {
    name: HomeUniversityName.SUNGSHIN,
    slug: "sungshin",
    imageUrl: "/images/unvis/sungsin.jpg",
    description: "성신여자대학교 파견 교환학생 정보",
  },
];

export interface RegionOption {
  value: string;
  label: string;
}

export enum RegionEnumExtend {
  ALL = "전체",
  AMERICAS = "미주권", // 미주권
  EUROPE = "유럽권", // 유럽권
  ASIA = "아시아권", // 아시아권
  CHINA = "중국권", // 중국권
}

export enum RegionEnum {
  ASIA = "ASIA", // 아시아권
  AMERICAS = "AMERICAS", // 미주권
  EUROPE = "EUROPE", // 유럽권
  CHINA = "CHINA", // 중국권
}

export const regionMapping: Record<string, RegionEnum | null> = {
  전체: null, // 전체일 경우 필터 없이 전체 데이터를 조회하도록 처리할 수 있음
  미주권: RegionEnum.AMERICAS,
  유럽권: RegionEnum.EUROPE,
  아시아권: RegionEnum.ASIA,
  중국권: RegionEnum.CHINA,
};

export type Country = string;

export interface LanguageRequirement {
  languageTestType: string; // 어학 시험 종류
  minScore: string; // 최소 점수
}

export interface University {
  id: number;
  term: string; // 파견 연도와 학기 ex) "2022-1"
  koreanName: string;
  englishName: string;
  formatName: string;
  region: string;
  country: string;
  homepageUrl: string;
  logoImageUrl: string;
  backgroundImageUrl: string;
  detailsForLocal: string; // 지역 정보

  studentCapacity: number;
  tuitionFeeType: string; // 등록금 납부 유형
  semesterAvailableForDispatch: string; // 파견 가능 학기

  languageRequirements: LanguageRequirement[];
  detailsForLanguage: string; // 어학 세부 요건
  gpaRequirement: string; // 최저 성적 요건 - 최저 성적
  gpaRequirementCriteria: string; // 최저 성적 요건 - 기준
  semesterRequirement: string; // 최저 이수 학기

  detailsForApply: string; // 지원 자격 요건 - 기타
  detailsForMajor: string; // 지원 전공 관련
  detailsForAccommodation: string; // 기숙사 中 텍스트
  accommodationUrl: string; // 기숙사 中 링크
  detailsForEnglishCourse: string; // // 영어 강의 리스트 中 텍스트
  englishCourseUrl: string; // 영어 강의 리스트 中 링크
  details: string; // 비고
}

export interface ListUniversity {
  id: number;
  term: string;
  koreanName: string;
  region: string;
  country: string;
  logoImageUrl: string;
  backgroundImageUrl: string;
  studentCapacity: number;
  languageRequirements: LanguageRequirement[];
  homeUniversityName?: HomeUniversityName;
}

/**
 * 권역별 대학 리스트 응답 타입
 * - Enum 값(전체·미주·유럽·아시아·중국)을 key 로 사용한다.
 */
export type AllRegionsUniversityList = Record<RegionEnumExtend, ListUniversity[]>;

export interface UniversityFavoriteStatusResponse {
  isLike: boolean;
}

export interface UniversityFavoriteResponse {
  result: "LIKE_SUCCESS" | "LIKE_CANCELED";
}

export interface RecommendedUniversitiesResponse {
  recommendedUniversities: ListUniversity[];
}

export enum LanguageTestType {
  CEFR = "CEFR",
  JLPT = "JLPT",
  DALF = "DALF",
  DELF = "DELF",
  DUOLINGO = "DUOLINGO",
  IELTS = "IELTS",
  NEW_HSK = "NEW_HSK",
  TCF = "TCF",
  TEF = "TEF",
  TOEFL_IBT = "TOEFL_IBT",
  TOEFL_ITP = "TOEFL_ITP",
  TOEIC = "TOEIC",
}

export enum CountryCode {
  AT = "AT", // 오스트리아
  AU = "AU", // 호주
  AZ = "AZ", // 아제르바이잔
  BE = "BE", // 벨기에
  BN = "BN", // 브루나이
  BR = "BR", // 브라질
  CA = "CA", // 캐나다
  CH = "CH", // 스위스
  CN = "CN", // 중국
  CZ = "CZ", // 체코
  DE = "DE", // 독일
  DK = "DK", // 덴마크
  ES = "ES", // 스페인
  FI = "FI", // 핀란드
  FR = "FR", // 프랑스
  GB = "GB", // 영국
  GE = "GE", // 조지아
  HK = "HK", // 홍콩
  HU = "HU", // 헝가리
  ID = "ID", // 인도네시아
  IL = "IL", // 이스라엘
  IT = "IT", // 이탈리아
  JP = "JP", // 일본
  KG = "KG", // 키르기스스탄
  KZ = "KZ", // 카자흐스탄
  LT = "LT", // 리투아니아
  MY = "MY", // 말레이시아
  NL = "NL", // 네덜란드
  NO = "NO", // 노르웨이
  PL = "PL", // 폴란드
  PT = "PT", // 포르투갈
  RU = "RU", // 러시아
  SE = "SE", // 스웨덴
  SG = "SG", // 싱가포르
  TH = "TH", // 태국
  TR = "TR", // 튀르키예
  TW = "TW", // 대만
  US = "US", // 미국
  UZ = "UZ", // 우즈베키스탄
}

/**
 * 점수 값으로 올 수 있는 타입 (숫자 또는 문자열 레벨)
 */
export type TestScoreValue = number | string;

/**
 * 각 언어 시험의 상세 정보를 담는 인터페이스
 */
export interface TestScoreInfo {
  name: string;
  type: "numeric" | "level";
  min?: number;
  max?: number;
  levels?: readonly string[]; // 읽기 전용 배열로 설정
}
