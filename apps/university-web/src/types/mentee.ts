export interface MentoringListItem {
  mentoringId: number;
  profileImageUrl: string | null;
  nickname: string;
  isChecked: boolean;
  createdAt: string;
}

export enum VerifyStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
}
