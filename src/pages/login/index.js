import { useRouter } from "next/router";

import ImageCarousel from "@/components/login/image-carousel";
import KakaoLoginButton from "@/components/login/kakao-login-button";
import BlockBtn from "@/components/ui/block-btn";

export default function KakaoLoginPage() {
  const router = useRouter();
  function kakaoLogin() {
    window.Kakao.Auth.authorize({
      redirectUri: `${process.env.NEXT_PUBLIC_WEB_URL}/login/kakao/callback`,
    });
  }
  return (
    <div>
      <ImageCarousel />
      <div style={{ marginTop: "40px" }}>
        <KakaoLoginButton onClick={kakaoLogin} />
        <BlockBtn
          onClick={() => {
            router.push("/");
          }}
          style={{ margin: "8px 20px 0 20px", width: "calc(100% - 40px)" }}
        >
          비회원으로 둘러보기
        </BlockBtn>
      </div>
    </div>
  );
}
