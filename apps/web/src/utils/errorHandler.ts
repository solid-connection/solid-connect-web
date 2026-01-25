import { AxiosError } from "axios";
import { toast } from "@/lib/zustand/useToastStore";
import { AuthenticationRequiredError } from "@/utils/axiosInstance";

/**
 * 중앙화된 mutation 에러 처리 함수
 * @param error - 발생한 에러
 * @param defaultMessage - 기본 에러 메시지
 * @param onAuthError - 인증 에러 시 실행할 콜백 (선택적)
 */
export const handleMutationError = (
  error: unknown,
  defaultMessage: string = "요청에 실패했습니다.",
  onAuthError?: () => void,
): void => {
  // 인증 관련 에러는 조용히 처리 (이미 redirectToLogin이 처리함)
  if (error instanceof AuthenticationRequiredError) {
    onAuthError?.();
    return;
  }

  // Axios 에러 처리
  if (error instanceof AxiosError) {
    const errorMessage = (error.response?.data as { message?: string })?.message || defaultMessage;
    console.error("API Error:", errorMessage, error);
    toast.error(errorMessage);
    return;
  }

  // 기타 에러 처리
  console.error("Unknown Error:", error);
  toast.error(defaultMessage);
};

/**
 * React Query mutation의 onError 핸들러를 위한 헬퍼 함수
 * @param defaultMessage - 기본 에러 메시지
 * @param onAuthError - 인증 에러 시 실행할 콜백 (선택적)
 * @returns onError 핸들러 함수
 */
export const createMutationErrorHandler = (
  defaultMessage: string = "요청에 실패했습니다.",
  onAuthError?: () => void,
) => {
  return (error: unknown) => {
    handleMutationError(error, defaultMessage, onAuthError);
  };
};
