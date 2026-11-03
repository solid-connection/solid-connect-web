import { publicAxiosInstance } from "@/utils/axiosInstance";
import { isTokenExpired } from "@/utils/jwtUtils";

/**
 * @description 토큰 재발급 서버사이드 함수
 * axiosInstance의 interceptor에서 사용됨
 */
const postReissueToken = async (): Promise<string> => {
  const response = await publicAxiosInstance.post<{ accessToken: string }>("/auth/reissue");
  const newAccessToken = response.data.accessToken;

  if (!newAccessToken) {
    throw new Error("재발급된 토큰이 유효하지 않습니다.");
  }
  if (isTokenExpired(newAccessToken)) {
    throw new Error("재발급된 토큰이 이미 만료되었습니다.");
  }

  return newAccessToken;
};

export default postReissueToken;
