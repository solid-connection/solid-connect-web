export type ExchangeStatus =
  | "STUDYING_ABROAD" // 현재 연수 중
  | "FINISHED" // 연수 종료
  | "PLANNED"; // 연수 예정

export enum ChannelType {
  BLOG = "Blog",
  BRUNCH = "Brunch",
  INSTAGRAM = "Instagram",
  YOUTUBE = "Youtube",
}

export interface MentorChannel {
  type: ChannelType;
  url: string;
}

/** 멘토 카드 공통 필드 (리스트·상세 공용) */
export interface MentorCardBase {
  id: number; // 멘토 아이디
  profileImageUrl: string;
  nickname: string;
  country: string; // 국가 (한국어 표기)
  universityName: string;
  exchangeStatus: ExchangeStatus;
  menteeCount: number;
  hasBadge: boolean;
  introduction: string;
  channels: MentorChannel[];
}

/** 리스트(미리보기) 용 – passTip / isApplied 없이 사용 */
export type MentorCardPreview = MentorCardBase;

/** 상세 뷰 용 – 추가 정보 포함 */
export interface MentorCardDetail extends MentorCardBase {
  passTip: string;
  isApplied: boolean;
  studyStatus: "24-1" | "24-2"; // 학업 상태 (예: "24-1")
}
