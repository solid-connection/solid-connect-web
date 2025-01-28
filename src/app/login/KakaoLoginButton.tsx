"use client";

import Image from "next/image";

type KakaoLoginButtonProps = {
  onClick: () => void;
  className?: string;
};

const KakaoLoginButton = ({ onClick, className = "" }: KakaoLoginButtonProps) => (
  <button type="button" onClick={onClick} className={className}>
    <Image src="/images/login/kakao_login_large_wide.png" alt="카카오 로그인" width={599} height={90} />
  </button>
);

export default KakaoLoginButton;
