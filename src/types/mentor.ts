export interface MentorResponse {
  nextPageNumber: number;
  content: Mentor[];
}
export interface MentorListParams {
  region?: string;
  size?: number;
  page?: number;
}

export interface Mentor {
  id: number;
  profileImageUrl: string | null;
  nickname: string;
  country: string;
  universityName: string;
  term: string;
  menteeCount: number;
  hasBadge: boolean;
  introduction: string;
  channels: MentorChannel[];
  isApplied: boolean;
}
/** 리스트(미리보기) 용 – passTip / isApplied 없이 사용 */
export type MentorCardPreview = (MentorCardBase & { term: string }) | null; // 학업 학기 (예: "2026-1")

/** 상세 뷰 용 – 추가 정보 포함 */
export interface MentorCardDetail extends MentorCardBase {
  passTip: string;
  isApplied: boolean;
  term: string; // 학업 학기 (예: "2026-1")
}

export interface MentorChannel {
  type: ChannelType;
  url: string;
}

export enum FilterTab {
  ALL = "전체",
  EUROPE = "유럽권",
  AMERICAS = "미주권",
  ASIA = "아시아권",
  CHINA = "중국권",
}

export enum ChannelType {
  BLOG = "BLOG",
  BRUNCH = "BRUNCH",
  INSTAGRAM = "INSTAGRAM",
  YOUTUBE = "YOUTUBE",
}

export enum MentorTab {
  MY_MENTEE = "나의 멘티",
  APPLY_LIST = "신청 목록",
}

export enum MenteeTab {
  MY_MENTOR = "나의 멘토",
  MY_APPLIED = "신청목록",
}

export enum UserRole {
  MENTOR = "MENTOR",
  MENTEE = "MENTEE",
  ADMIN = "ADMIN",
}

export enum MentorStudyStatus {
  STUDYING = "STUDYING", // 현재 연수 중
  COMPLETED = "COMPLETED", // 연수 종료
  SCHEDULED = "SCHEDULED", // 연수 예정
}

export type ExchangeStatus =
  | "STUDYING_ABROAD" // 현재 연수 중
  | "FINISHED" // 연수 종료
  | "PLANNED"; // 연수 예정

/** 멘토 카드 공통 필드 (리스트·상세 공용) */
export interface MentorCardBase {
  id: number; // 멘토 아이디
  profileImageUrl: string | null;
  nickname: string;
  country: string; // 국가 (한국어 표기)
  universityName: string;
  menteeCount: number;
  hasBadge: boolean;
  introduction: string;
  channels: MentorChannel[];
}

export interface MentoringItem {
  mentoringId: number;
  profileImageUrl: string | null;
  nickname: string;
  isChecked: boolean;
  createdAt: string;
  verifyStatus: MentoringApplyStatus;
}

export enum MentoringApprovalStatus {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum MentoringApplyStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
