import useFetch from "@/utils/apiUtils";

/* ---------- 타입 ---------- */
export interface ChannelPayload {
  type: string;
  url: string;
}

export interface PutMyMentorProfileBody {
  channels: ChannelPayload[];
  passTip: string;
  introduction: string;
}

const usePutMyMentorProfile = () => {
  const { loading, error, fetchData } = useFetch<void>();

  const putMyMentorProfile = (body: PutMyMentorProfileBody) => {
    fetchData({
      method: "put",
      url: "/mentors/me",
      body,
      isToken: true,
    });
  };

  return { putMyMentorProfile, loading, error };
};

export default usePutMyMentorProfile;
