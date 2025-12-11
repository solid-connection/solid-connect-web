"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";

import usePostAppleAuth from "@/api/auth/client/usePostAppleAuth";

const AppleLoginCallbackPage = () => {
  const searchParams = useSearchParams();
  const { mutate: postAppleAuth } = usePostAppleAuth();

  useEffect(() => {
    const code = searchParams?.get("code");
    if (code) {
      postAppleAuth({ code });
    }
  }, [searchParams, postAppleAuth]);

  return <CloudSpinnerPage />;
};

export default AppleLoginCallbackPage;
