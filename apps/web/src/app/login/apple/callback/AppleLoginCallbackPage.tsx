"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePostAppleAuth } from "@/apis/Auth";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";

const attemptedAppleAuthCodes = new Set<string>();

const AppleLoginCallbackPage = () => {
  const searchParams = useSearchParams();
  const { mutate: postAppleAuth } = usePostAppleAuth();

  useEffect(() => {
    const code = searchParams?.get("code");

    if (!code || attemptedAppleAuthCodes.has(code)) return;

    attemptedAppleAuthCodes.add(code);
    postAppleAuth({ code });
  }, [searchParams, postAppleAuth]);

  return <CloudSpinnerPage />;
};

export default AppleLoginCallbackPage;
