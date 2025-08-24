import { UserRole } from "./mentor";

export type AuthType = "EMAIL" | "KAKAO" | "APPLE";

export interface BaseUserInfo {
  likedUniversityCount: number;
  nickname: string;
  profileImageUrl: string | null;
  role: UserRole;
  authType: string;
  email: string;
  likedPostCount: number;
  likedMentorCount: number;
}

export interface MyInfo {
  nickname: string;
  profileImageUrl: string | null;
  role: "MENTOR" | "MENTEE";
  authType: "EMAIL" | "KAKAO" | "APPLE";
  birth: string;
  likedPostCount: number;
  likedMentoCount: number;
  likedUniversityCount: number;
  email: string;
}

export interface MyInfoSimple {
  nickname: string;
  profileImageUrl: string;
}

export interface MyInfoPatchRequest {
  // 내 정보 수정 페이지에서 사용
  nickname?: string;
  file?: Blob; // 프로필 이미지
}
