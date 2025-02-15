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
  // 내 정보 수정 페이지에서 사용
  nickname: string;
  profileImageUrl: string;
}

export interface MyNickname {
  nickname: string;
}

export interface MyProfileImage {
  profileImageUrl: string;
}
