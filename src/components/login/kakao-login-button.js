import Image from "next/image";
import styles from "./kakao-login-button.module.css";

export default function KakaoLoginButton(props) {
  const { onClick } = props;
  return <img style={props.style} className={styles.image} src="/images/kakao_login_large_wide.png" alt="카카오 로그인" width={600} height={90} onClick={onClick} />;
}
