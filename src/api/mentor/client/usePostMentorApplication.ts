import { axiosInstance } from "@/utils/axiosInstance";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation } from "@tanstack/react-query";

export interface PostMentorApplicationRequest {
  interestedCountries: string[]; // 관심 국가 목록
  country: string; // 수학 국가
  universityName: string; // 수학 학교
  studyStatus: "STUDYING" | "PLANNING" | "COMPLETED"; // 준비 단계
  verificationFile: File; // 증명서 파일
}

const postMentorApplication = async (body: PostMentorApplicationRequest): Promise<void> => {
  const formData = new FormData();

  // JSON 데이터를 Blob으로 추가
  const applicationData = {
    interestedCountries: body.interestedCountries,
    country: body.country,
    universityName: body.universityName,
    studyStatus: body.studyStatus,
  };

  formData.append(
    "mentorApplicationRequest",
    new Blob([JSON.stringify(applicationData)], { type: "application/json" }),
  );

  // 파일 추가
  formData.append("file", body.verificationFile);

  const res = await axiosInstance.post<void>("/mentor/verification", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

const usePostMentorApplication = () => {
  return useMutation({
    mutationFn: postMentorApplication,
    onError: (error) => {
      toast.error("멘토 신청에 실패했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePostMentorApplication;
