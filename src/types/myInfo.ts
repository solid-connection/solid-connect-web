import { ListCollege } from "./college";

export interface MyInfo {
  nickname: string;
  profileImageUrl: string;
  role: "MENTOR" | "MENTEE";
  birth: `${number}-${number}-${number}`;
  likedPostCount: number;
  likedMentoCount: number;
  likedUniversityCount: number;
}

export interface MyInfoSimple {
  // 내 정보 수정 페이지에서 사용
  nickname: string;
  profileImageUrl: string;
}

export type MyWishUniversity = ListCollege[];
