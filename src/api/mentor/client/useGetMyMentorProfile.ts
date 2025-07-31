import { useEffect, useState } from "react";

import useFetch from "@/utils/apiUtils";

import { MentorCardPreview } from "../type/response";

interface UseGetMyMentorDataReturn {
  myMentorProfile: MentorCardPreview;
  loading: boolean;
  error: unknown;
}

const useGetMyMentorProfile = (): UseGetMyMentorDataReturn => {
  const { result, loading, error, fetchData } = useFetch<MentorCardPreview>();
<<<<<<< HEAD
  const [myMentorProfile, setMyMentorProfile] = useState<MentorCardPreview>(null);
=======
  const [myMentorProfile, setMyMentorProfile] = useState<MentorCardPreview>({} as MentorCardPreview);
>>>>>>> main

  useEffect(() => {
    fetchData({
      method: "get",
      url: "/mentor/my",
      body: undefined,
      isToken: true,
    });
  }, [fetchData]);

  useEffect(() => {
    if (result) {
      setMyMentorProfile(result.data);
    }
  }, [result]);

  return {
    myMentorProfile,
    loading,
    error,
  };
};

export default useGetMyMentorProfile;
