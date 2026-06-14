"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePostAppleAuth } from "@/apis/Auth";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import { AUTH_REDIRECT_PARAM, getSafeCommunityRedirectPath } from "@/utils/authRedirect";

const attemptedAppleAuthCodes = new Set<string>();

const AppleLoginCallbackPage = () => {
  const searchParams = useSearchParams();
  const redirectPath = getSafeCommunityRedirectPath(searchParams?.get(AUTH_REDIRECT_PARAM)) ?? undefined;
  const { mutate: postAppleAuth } = usePostAppleAuth({ redirectPath });

  useEffect(() => {
    const code = searchParams?.get("code");

    if (!code || attemptedAppleAuthCodes.has(code)) return;

    attemptedAppleAuthCodes.add(code);
    postAppleAuth({ code });
  }, [searchParams, postAppleAuth]);

  return <CloudSpinnerPage />;
};

export default AppleLoginCallbackPage;
