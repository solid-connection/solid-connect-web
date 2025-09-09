import { publicAxiosInstance } from "@/utils/axiosInstance";

import useAuthStore from "@/lib/zustand/useAuthStore";

const postReissueToken = async (): Promise<string> => {
  try {
    const response = await publicAxiosInstance.post<{ accessToken: string }>("/auth/reissue");
    const newAccessToken = response.data.accessToken;

    if (!newAccessToken) {
      throw new Error("재발급된 토큰이 유효하지 않습니다.");
    }

    // 재발급 성공 시, 새로운 토큰을 Zustand 스토어에 저장
    useAuthStore.getState().setAccessToken(newAccessToken);

    return newAccessToken;
  } catch (error) {
    // 재발급 실패 시 스토어 상태 초기화
    useAuthStore.getState().clearAccessToken();
    throw error;
  }
};
export default postReissueToken;
