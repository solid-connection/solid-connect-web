"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePostKakaoAuth } from "@/apis/Auth";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";

const attemptedKakaoAuthCodes = new Set<string>();

const KakaoLoginCallbackPage = () => {
  const searchParams = useSearchParams();
  const { mutate: postKakaoAuth } = usePostKakaoAuth();
  const code = searchParams?.get("code");

  useEffect(() => {
    if (!code) {
      return;
    }

    // Strict Mode remount/useEffect 재실행 시 동일 인가코드 중복 호출 방지
    if (attemptedKakaoAuthCodes.has(code)) {
      return;
    }

    attemptedKakaoAuthCodes.add(code);
    postKakaoAuth({ code });
  }, [code, postKakaoAuth]);

  return <CloudSpinnerPage />;
};

export default KakaoLoginCallbackPage;
