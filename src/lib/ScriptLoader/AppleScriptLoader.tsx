"use client";

import Script from "next/script";

const AppleScriptLoader = () => {
  return (
    <Script
      type="text/javascript"
      src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
    ></Script>
  );
};

export default AppleScriptLoader;
