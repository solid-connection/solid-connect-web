"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import BlockBtn from "@/components/button/block-btn";

import ImageCarousel from "./ImageCarousel";
import KakaoLoginButton from "./KakaoLoginButton";

import { useLayout } from "@/context/LayoutContext";

const KakaoLoginPage = () => {
  const { setHideBottomNavigation } = useLayout();

  useEffect(() => {
    setHideBottomNavigation(true);
    return () => setHideBottomNavigation(false); // 컴포넌트가 언마운트될 때 다시 보이게 설정
  }, [setHideBottomNavigation]);

  const router = useRouter();

  const kakaoLogin = () => {
    if (window.Kakao && window.Kakao.Auth) {
      window.Kakao.Auth.authorize({
        redirectUri: `${process.env.NEXT_PUBLIC_WEB_URL}/login/kakao/callback`,
      });
    } else {
      alert("Kakao SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div>
      <ImageCarousel />
      <div style={{ marginTop: "40px" }}>
        <KakaoLoginButton onClick={kakaoLogin} />
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
};

export default KakaoLoginPage;
