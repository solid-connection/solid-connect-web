import { useRouter } from "next/router";
import { useEffect } from "react";

import BlockBtn from "@/components/button/block-btn";
import ImageCarousel from "@/components/login/image-carousel";
import KakaoLoginButton from "@/components/login/kakao-login-button";

import { useLayout } from "@/context/LayoutContext";

export default function KakaoLoginPage() {
  const { setHideBottomNavigation } = useLayout();
  useEffect(() => {
    setHideBottomNavigation(true);
    return () => setHideBottomNavigation(false); // 컴포넌트가 언마운트 될 때 다시 보이게 설정
  }, []);

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
        <KakaoLoginButton
          onClick={() => {
            kakaoLogin();
          }}
        />
        <BlockBtn
          onClick={() => {
            router.push("/");
          }}
          style={{
            margin: "8px 20px 0 20px",
            width: "calc(100% - 40px)",
            height: "calc((100vw - 40px) * 0.15)",
            minHeight: "48px",
            maxHeight: "84px",
          }}
        >
          비회원으로 둘러보기
        </BlockBtn>
      </div>
    </div>
  );
}
