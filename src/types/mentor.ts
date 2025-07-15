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
  profileImageUrl?: string;
  nickname: string;
  country: string;
  universityName: string;
  studyStatus: MentorStudyStatus;
  menteeCount: number;
  hasBadge: boolean;
  introduction: string;
  channels: Channel[];
  isApplied: boolean;
}

export interface Channel {
  type: ChannelType;
  url: string;
}

export interface ChatMessage {
  id: number;
  sender: "me" | "other";
  senderName: string;
  message: string;
  time: Date;
}
export enum MentorStudyStatus {
  STUDYING = "수학 중인 멘토",
  SCHEDULED = "수학 예정 멘토",
  COMPLETED = "수학 완료 멘토",
}

export enum FilterTab {
  ALL = "전체",
  EUROPE = "유럽권",
  AMERICAS = "미주권",
  ASIA = "아시아권",
}

export enum ChannelType {
  BLOG = "Blog",
  BRUNCH = "Brunch",
  INSTAGRAM = "Instagram",
  YOUTUBE = "Youtube",
}

export enum MentorTab {
  MY_MENTOR = "나의 멘토",
  MY_MENTEE = "나의 멘티",
}

export enum MenteeTab {
  MY_MENTOR = "나의 멘토",
  MY_APPLIED = "신청목록",
}
