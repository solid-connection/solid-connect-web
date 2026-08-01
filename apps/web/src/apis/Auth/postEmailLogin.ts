import { useMutation } from "@tanstack/react-query";

import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { SKIP_GLOBAL_ERROR_TOAST_META } from "@/lib/react-query/errorToastMeta";
import { showIconToast } from "@/lib/toast/showIconToast";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { getCommunityRedirectOrFallback } from "@/utils/authRedirect";
import { type AuthRedirectOptions, authApi, type EmailLoginRequest, type EmailLoginResponse } from "./api";

const EMAIL_LOGIN_FAILURE_MESSAGE = "이메일 또는 비밀번호를 확인해주세요.";

type EmailLoginErrorResponse = {
  message?: string;
};

/**
 * @description 이메일 로그인을 위한 useMutation 커스텀 훅
 */
const usePostEmailAuth = ({ redirectPath }: AuthRedirectOptions = {}) => {
  const { setAccessToken } = useAuthStore();
  const router = useRouter();

  return useMutation<EmailLoginResponse, AxiosError<EmailLoginErrorResponse>, EmailLoginRequest>({
    mutationFn: (data) => authApi.postEmailLogin(data),
    // 로그인 API는 publicAxiosInstance를 사용해 전역 401 인터셉터/토스트가 적용되지 않으므로
    // 전역 에러 토스트를 건너뛰고 이 mutation에서 직접 처리한다.
    meta: SKIP_GLOBAL_ERROR_TOAST_META,
    onSuccess: (data) => {
      const { accessToken } = data;

      // Zustand persist가 자동으로 localStorage에 저장
      // refreshToken은 서버에서 HTTP-only 쿠키로 자동 설정됨
      setAccessToken(accessToken);

      showIconToast("logo", "로그인에 성공했습니다.");

      // Zustand persist middleware가 localStorage에 저장할 시간을 보장
      // 토큰 저장 후 리다이렉트하여 타이밍 이슈 방지
      setTimeout(() => {
        router.push(getCommunityRedirectOrFallback(redirectPath));
      }, 100);
    },
    onError: (error) => {
      const message = error.response?.data?.message || EMAIL_LOGIN_FAILURE_MESSAGE;

      // 로그인 실패는 사용자가 자격증명을 고쳐 곧바로 재시도하는 경우가 많아
      // 동일 메시지 억제(dedupe)를 끄고 매 시도마다 토스트를 노출한다.
      showIconToast("logo", message, { dedupe: false });
    },
  });
};

export default usePostEmailAuth;
