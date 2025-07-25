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

export interface MentorCardResponse {
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
  isApplied: boolean; // 신청 여부
  studyStatus: "24-1" | "24-2"; // 학업 상태 (예: "21-1")
}

export interface MentorListResponse {
  /** 다음 페이지 번호. 다음 페이지가 없으면 -1 */
  nextPageNumber: number;
  content: MentorCardResponse[];
}
