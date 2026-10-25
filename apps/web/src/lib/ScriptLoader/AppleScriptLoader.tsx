"use client";

import Script from "next/script";

const APPLE_SDK_URL = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";

interface AppleScriptLoaderProps {
  retryKey: string | null;
  onReady: () => void;
  onError: () => void;
}

const AppleScriptLoader = ({ retryKey, onReady, onError }: AppleScriptLoaderProps) => (
  <Script
    type="text/javascript"
    src={retryKey ? `${APPLE_SDK_URL}?retry=${retryKey}` : APPLE_SDK_URL}
    strategy="afterInteractive"
    onReady={onReady}
    onError={onError}
  />
);

export default AppleScriptLoader;
