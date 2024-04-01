import { Region, Country } from "./college";

export const ACCESS_TOKEN_EXPIRE_TIME = 1 / 24;
export const REFRESH_TOKEN_EXPIRE_TIME = 7;
export const ACCESS_TOKEN_COOKIE_NAME = "accessToken";
export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

export type PreparationStatus = "CONSIDERING" | "PREPARING_FOR_DEPARTURE" | "STUDYING_ABROAD";
export interface RegisterRequest {
  kakaoOauthToken: string; // 최초 접속 시 발급받는 토큰
  interestedRegions: Region[]; // 한글 지역명 e.g. 미주권
  interestedCountries: Country[]; // 한글 국가명 e.g. 영국
  preparationStatus: PreparationStatus; // 준비 단계
  nickname: string; // 닉네임
  profileImageUrl: string; // 프로필 이미지
  gender: "MALE" | "FEMALE" | "PREFER_NOT_TO_SAY"; // 성별
  birth: string; // 생년월일 yyyy-mm-dd
}

export interface KakaoLoginResponse {
  success: boolean;
  data: {
    registered: boolean;
    // if registered is true
    accessToken?: string;
    refreshToken?: string;
    // if registered is false
    kakaoOauthToken?: string; // 가입 요청시 같이 보낼 임시 토큰
    nickname?: string;
    email?: string;
    profileImageUrl?: string;
  };
  error?: {
    code: number;
    message: string;
  };
}
