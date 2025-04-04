export interface MyInfo {
  nickname: string;
  profileImageUrl: string;
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
