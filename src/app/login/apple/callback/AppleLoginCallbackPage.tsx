"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { validateSafeRedirect } from "@/utils/authUtils";

import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";

import usePostAppleAuth from "@/api/auth/client/usePostAppleAuth";

const AppleLoginCallbackPage = () => {
  const searchParams = useSearchParams();
  const { mutate: postAppleAuth } = usePostAppleAuth();

  useEffect(() => {
    const code = searchParams?.get("code");
    if (code) {
      // redirect 파라미터 검증 (usePostAppleAuth에서도 재검증됨)
      const redirectParam = searchParams?.get("redirect");
      validateSafeRedirect(redirectParam);

      postAppleAuth({ code });
    }
  }, [searchParams, postAppleAuth]);

  return <CloudSpinnerPage />;
};

export default AppleLoginCallbackPage;
