"use client";

import Image from "next/image";

type KakaoLoginButtonProps = {
  onClick: () => void;
  className?: string;
};

const AppleLoginButton = ({ onClick, className = "" }: KakaoLoginButtonProps) => (
  <button type="button" onClick={onClick} className={className}>
    <Image src="/images/login/apple-login-button.svg" alt="애플 로그인" width={599} height={90} />
  </button>
);

export default AppleLoginButton;
