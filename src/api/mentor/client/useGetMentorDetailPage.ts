import { useEffect, useState } from "react";

import useFetch from "@/utils/apiUtils";

import { MentorCardDetail } from "../type/response";

const useGetMentorDetailPage = (mentorId: number | null) => {
  const { result, loading, error, fetchData } = useFetch<MentorCardDetail>();
  const [mentorDetail, setMentorDetail] = useState<MentorCardDetail | null>(null);

  useEffect(() => {
    if (mentorId === null) return;
    // 멘토 상세 정보 요청
    fetchData({
      method: "get",
      url: `/mentors/${mentorId}`,
      body: null,
      isToken: true,
    });
  }, [mentorId, fetchData]);

  useEffect(() => {
    if (result) {
      setMentorDetail(result.data);
    }
  }, [result]);

  return { mentorDetail, loading, error };
};

export default useGetMentorDetailPage;
