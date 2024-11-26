"use client";

import Image from "next/image";

import styles from "./kakao-login-button.module.css";

type KakaoLoginButtonProps = {
  onClick: () => void;
  style?: React.CSSProperties;
};

const KakaoLoginButton = ({ onClick, style }: KakaoLoginButtonProps) => (
  <button type="button" onClick={onClick} style={style} className={styles.image}>
    <Image src="/images/kakao_login_large_wide.png" alt="카카오 로그인" width={599} height={90} />
  </button>
);

export default KakaoLoginButton;
