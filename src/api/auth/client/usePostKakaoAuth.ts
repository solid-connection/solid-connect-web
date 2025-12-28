import { useRouter, useSearchParams } from "next/navigation";

import { AxiosResponse } from "axios";

import { validateSafeRedirect } from "@/utils/authUtils";
import { publicAxiosInstance } from "@/utils/axiosInstance";

import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";
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
  const { setAccessToken } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: postKakaoAuth,
    onSuccess: (response) => {
      const { data } = response;

      if (data.isRegistered) {
        // 기존 회원일 시 - Zustand persist가 자동으로 localStorage에 저장
        // refreshToken은 서버에서 HTTP-only 쿠키로 자동 설정됨
        setAccessToken(data.accessToken);

        // 안전한 리다이렉트 처리 - 오픈 리다이렉트 방지
        const redirectParam = searchParams.get("redirect");
        const safeRedirect = validateSafeRedirect(redirectParam);

        toast.success("로그인에 성공했습니다.");
        router.replace(safeRedirect);
      } else {
        // 새로운 회원일 시 - 회원가입 페이지로 이동
        router.push(`/sign-up?token=${data.signUpToken}`);
      }
    },
    onError: () => {
      toast.error("카카오 로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      router.push("/login");
    },
  });
};

export default usePostKakaoAuth;
