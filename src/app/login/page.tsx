"use client";

import Link from "next/link";
import { useEffect } from "react";

import BlockBtn from "@/components/button/BlockBtn";

import AppleLoginButton from "./AppleLoginButton";
import KakaoLoginButton from "./KakaoLoginButton";

import { useLayout } from "@/context/LayoutContext";
import { IconSolidConnectionFullBlackLogo } from "@/public/svgs";

const KakaoLoginPage = () => {
  const { setHideBottomNavigation } = useLayout();

  useEffect(() => {
    setHideBottomNavigation(true);
    return () => setHideBottomNavigation(false); // 컴포넌트가 언마운트될 때 다시 보이게 설정
  }, [setHideBottomNavigation]);

  const kakaoLogin = () => {
    if (window.Kakao && window.Kakao.Auth) {
      window.Kakao.Auth.authorize({
        redirectUri: `${process.env.NEXT_PUBLIC_WEB_URL}/login/kakao/callback`,
      });
    } else {
      alert("Kakao SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const appleLogin = async () => {
    if (!window.AppleID || !window.AppleID.auth) {
      alert("Apple SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    window.AppleID.auth.init({
      clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
      scope: process.env.NEXT_PUBLIC_APPLE_SCOPE,
      redirectURI: `${process.env.NEXT_PUBLIC_WEB_URL}/login/apple/callback`,
      // state: '[STATE]',
      // nonce: '[NONCE]',
      usePopup: false,
    });

    try {
      const res = await window.AppleID.auth.signIn();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const emailLogin = () => {
    alert("이메일 로그인은 준비 중입니다.");
  };

  return (
    <div>
      <div className="mt-[-56px] h-[77px] border-b border-[#f5f5f5] py-[21px] pl-5">
        <Link href="/">
          <IconSolidConnectionFullBlackLogo />
        </Link>
      </div>
      <div className="h-[229px] pt-[90px]">
        <div className="text-center font-serif text-[22px] font-bold text-k-900">로그인</div>
        <div className="text-center font-serif text-xs font-medium leading-normal text-k-300">
          교환학생을 위한 여정
          <br />
          지금 솔리드 커넥션에서 시작하세요.
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-3">
          <div className="mx-5">
            <input
              type="text"
              placeholder="이메일"
              className="h-[41px] w-full rounded-lg border px-5 py-3 font-serif text-xs font-normal leading-normal text-k-400 focus:outline-none"
            />
          </div>
          <div className="mx-5 transition active:scale-95">
            <BlockBtn onClick={emailLogin}>이메일로 시작하기</BlockBtn>
          </div>
          <div className="text-center font-serif text-base font-medium text-k-300">or</div>
          <div className="mx-5 transition active:scale-95">
            <KakaoLoginButton onClick={kakaoLogin} />
          </div>
          <div className="mx-5 transition active:scale-95">
            <AppleLoginButton onClick={appleLogin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KakaoLoginPage;
