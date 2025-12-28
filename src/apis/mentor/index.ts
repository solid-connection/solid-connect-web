export { mentorApi, MentorQueryKeys } from "./api";
export type {
  MentorCardPreview,
  MentorCardDetail,
  MentoringItem,
  MentoringApprovalStatus,
  MentoringListItem,
  VerifyStatus,
  PutMyMentorProfileRequest,
  PostMentorApplicationRequest,
} from "./api";

// Mentor (멘토) hooks
export { default as useGetMentorMyProfile } from "./getMyMentorPage";
export { default as useGetMentoringList } from "./getReceivedMentorings";
export { default as useGetMentoringUncheckedCount } from "./getUnconfirmedMentoringCount";
export { default as usePatchApprovalStatus } from "./patchMentoringStatus";
export { default as usePatchMentorCheckMentorings } from "./patchConfirmMentoring";
export { default as usePostMentorApplication } from "./postMentorApplication";
export { default as usePutMyMentorProfile } from "./putUpdateMyMentorPage";

// Mentee (멘티) hooks
export { default as useGetApplyMentoringList, usePrefetchApplyMentoringList } from "./getAppliedMentorings";
export { default as usePatchMenteeCheckMentorings } from "./patchMenteeCheckMentorings";
export { default as usePostApplyMentoring } from "./postApplyMentoring";

// Mentors (멘토 목록) hooks
export { default as useGetMentorList, usePrefetchMentorList } from "./getMentorList";
export { default as useGetMentorDetail } from "./getMentorDetail";
