"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { saveAccessToken, saveRefreshToken } from "@/utils/localStorage";

import BlockBtn from "@/components/button/BlockBtn";

import AppleLoginButton from "./AppleLoginButton";
import EmailSignUpButton from "./EmailSignUpButton";
import KakaoLoginButton from "./KakaoLoginButton";

import { appleOAuth2CodeResponse } from "@/types/auth";

import { emailAuthApi } from "@/api/auth";
import { useLayout } from "@/context/LayoutContext";
import { IconSolidConnectionFullBlackLogo } from "@/public/svgs";

const LoginContent = () => {
  const router = useRouter();
  const { setHideBottomNavigation } = useLayout();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setHideBottomNavigation(true);
    return () => setHideBottomNavigation(false);
  }, [setHideBottomNavigation]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEmailLogin();
    }
  };

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
      usePopup: true,
    });

    try {
      const res: appleOAuth2CodeResponse = await window.AppleID.auth.signIn();
      if (res.authorization) {
        router.push(`/login/apple/callback?code=${res.authorization.code}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailLogin = async () => {
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    try {
      const response = await emailAuthApi(email, password);
      saveAccessToken(response.data.accessToken);
      saveRefreshToken(response.data.refreshToken);
      router.push("/");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "로그인에 실패했습니다.");
    }
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
              type="email"
              placeholder="이메일"
              className="h-[41px] w-full rounded-lg border px-5 py-3 font-serif text-xs font-normal leading-normal text-k-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div
            className={`mx-5 overflow-hidden transition-all duration-500 ease-in-out ${
              email.trim() ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <input
              type="password"
              placeholder="비밀번호"
              className="h-[41px] w-full rounded-lg border px-5 py-3 font-serif text-xs font-normal leading-normal text-k-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="mx-5 transition active:scale-95">
            <BlockBtn onClick={handleEmailLogin}>로그인</BlockBtn>
          </div>

          <div className="text-center font-serif text-base font-medium text-k-300">or</div>
          <div className="mx-5 transition active:scale-95">
            <KakaoLoginButton onClick={kakaoLogin} />
          </div>
          <div className="mx-5 transition active:scale-95">
            <EmailSignUpButton onClick={() => router.push("/sign-up/email")} />
          </div>
          <div className="mx-5 transition active:scale-95">
            <AppleLoginButton onClick={appleLogin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginContent;
