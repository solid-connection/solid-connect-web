import { Country, RegionKo } from "./university";

export type PreparationStatus = "CONSIDERING" | "PREPARING_FOR_DEPARTURE" | "STUDYING_ABROAD";

export type Gender = "MALE" | "FEMALE" | "PREFER_NOT_TO_SAY";

// eslint-disable-next-line no-shadow
export enum GenderEnum {
  MALE = "MALE",
  FEMALE = "FEMALE",
  PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY",
}

export interface RegisterRequest {
  kakaoOauthToken: string; // 최초 접속 시 발급받는 토큰
  interestedRegions: RegionKo[]; // 한글 지역명 e.g. 미주권
  interestedCountries: Country[]; // 한글 국가명 e.g. 영국
  preparationStatus: PreparationStatus; // 준비 단계
  nickname: string; // 닉네임
  profileImageUrl: string; // 프로필 이미지
  gender: Gender; // 성별
  birth: string; // 생년월일 yyyy-mm-dd
}

export interface RegisteredKakaoAuthReponse {
  isRegistered: true;
  accessToken: string;
  refreshToken: string;
}

export interface UnregisteredKakaoAuthReponse {
  isRegistered: false;
  nickname: string;
  email: string;
  profileImageUrl: string;
  kakaoOauthToken: string;
}

export interface KakaoSignUpResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ReissueAccessTokenResponse {
  accessToken: string;
}
