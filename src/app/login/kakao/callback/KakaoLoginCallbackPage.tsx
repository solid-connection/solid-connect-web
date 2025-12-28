"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";

import { usePostKakaoAuth } from "@/apis/Auth";

const KakaoLoginCallbackPage = () => {
  const searchParams = useSearchParams();
  const { mutate: postKakaoAuth } = usePostKakaoAuth();

  useEffect(() => {
    const code = searchParams?.get("code");
    if (code) {
      postKakaoAuth({ code });
    }
  }, [searchParams, postKakaoAuth]);

  return <CloudSpinnerPage />;
};

export default KakaoLoginCallbackPage;
