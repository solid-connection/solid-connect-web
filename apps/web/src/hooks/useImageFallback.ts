import { useState } from "react";

/**
 * 이미지 로드 실패 시 폴백 이미지를 표시하는 커스텀 훅
 * @param fallbackSrc - 폴백 이미지 경로
 * @returns [현재 이미지 src, 에러 핸들러]
 */
export const useImageFallback = (fallbackSrc: string) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  const getSrc = (originalSrc: string) => {
    return hasError ? fallbackSrc : originalSrc;
  };

  return { getSrc, handleError, hasError };
};
