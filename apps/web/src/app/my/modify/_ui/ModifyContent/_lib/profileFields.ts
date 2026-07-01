import type { MyInfoResponse } from "@/apis/MyPage";

export interface ModifyProfileReadOnlyFields {
  homeUniversityName: string;
  attendedUniversity: string;
}

export const resolveModifyProfileReadOnlyFields = (myInfo: MyInfoResponse): ModifyProfileReadOnlyFields => {
  const isMentorProfile = myInfo.role === "MENTOR" || myInfo.role === "ADMIN";

  return {
    homeUniversityName: myInfo.homeUniversityName ?? "",
    attendedUniversity: isMentorProfile ? myInfo.attendedUniversity : "",
  };
};
