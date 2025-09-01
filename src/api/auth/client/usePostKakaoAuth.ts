import { useRouter } from "next/navigation";

import { AxiosResponse } from "axios";

import { isCookieLoginEnabled } from "@/utils/authUtils";
import { publicAxiosInstance } from "@/utils/axiosInstance";
import { saveAccessTokenToLS } from "@/utils/localStorageUtils";

import useAuthStore from "@/lib/zustand/useAuthStore";
import { useMutation } from "@tanstack/react-query";

// Kakao
interface RegisteredKakaoAuthReponse {
  isRegistered: true;
  accessToken: string;
  refreshToken: string;
}

interface UnregisteredKakaoAuthReponse {
  isRegistered: false;
  nickname: string;
  email: string;
  profileImageUrl: string;
  signUpToken: string;
}

interface KakaoAuthRequest {
  code: string;
}

const postKakaoAuth = ({
  code,
}: KakaoAuthRequest): Promise<AxiosResponse<RegisteredKakaoAuthReponse | UnregisteredKakaoAuthReponse>> =>
  publicAxiosInstance.post("/auth/kakao", { code });

const usePostKakaoAuth = () => {
  const { setToken } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: postKakaoAuth,
    onSuccess: (response) => {
      const { data } = response;

      if (data.isRegistered) {
        // 기존 회원일 시 - 토큰 저장하고 홈으로 이동
        setToken(data.accessToken);

        // 로컬스토리지 모드일 때만 리프레시 토큰을 로컬스토리지에 저장
        if (!isCookieLoginEnabled() && data.refreshToken) {
          saveAccessTokenToLS(data.refreshToken);
        }

        router.push("/");
      } else {
        // 새로운 회원일 시 - 회원가입 페이지로 이동
        router.push(`/sign-up?token=${data.signUpToken}`);
      }
    },
    onError: (error) => {
      alert("카카오 로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      router.push("/login");
    },
  });
};

export default usePostKakaoAuth;
