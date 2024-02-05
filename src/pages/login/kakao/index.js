import KakaoLoginButton from "@/components/login/kakao-login-button";

export default function KakaoLoginPage() {
  function kakaoLogin() {
    window.Kakao.Auth.authorize({
      // redirectUri: "http://localhost:3000/login/kakao/callback",
      redirectUri: `${process.env.NEXT_PUBLIC_WEB_URL}/login/kakao/callback`,
    });
  }
  return (
    <div>
      <KakaoLoginButton onClick={kakaoLogin} />
    </div>
  );
}
