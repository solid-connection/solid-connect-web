"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { appleLogin, kakaoLogin } from "@/utils/authUtils";

import useInputHandler from "./_hooks/useInputHandler";

import usePostEmailAuth from "@/api/auth/client/usePostEmailAuth";
import { IconSolidConnectionFullBlackLogo } from "@/public/svgs";
import { IconAppleLogo, IconEmailIcon, IconKakaoLogo } from "@/public/svgs/auth";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod 스키마 정의
const loginSchema = z.object({
  email: z.string().min(1, "이메일을 입력해주세요.").email("올바른 이메일 형식을 입력해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요.").min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginContent = () => {
  const router = useRouter();
  const { mutate: postEmailAuth, isPending } = usePostEmailAuth();
  const { showPasswordField, handleEmailChange } = useInputHandler();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    postEmailAuth(data);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(onSubmit)();
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3">
          <div className="mx-5">
            <input
              type="email"
              placeholder="이메일"
              className="h-[41px] w-full rounded-lg border px-5 py-3 font-serif text-xs font-normal leading-normal text-k-400 focus:outline-none"
              {...register("email", {
                onChange: handleEmailChange,
              })}
              onKeyDown={handleKeyDown}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div
            className={`mx-5 overflow-hidden transition-all duration-500 ease-in-out ${
              showPasswordField ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <input
              type="password"
              placeholder="비밀번호"
              className="h-[41px] w-full rounded-lg border px-5 py-3 font-serif text-xs font-normal leading-normal text-k-400 focus:outline-none"
              {...register("password")}
              onKeyDown={handleKeyDown}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="mx-5 transition active:scale-95">
            <button
              type="submit"
              disabled={isPending}
              className="flex h-11 w-full items-center justify-center rounded-lg bg-primary p-2.5 font-serif text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-3">
        <div className="text-center font-serif text-base font-medium text-k-300">or</div>
        <div className="mt-3 flex flex-col gap-3">
          <div className="mx-5 transition active:scale-95">
            <button
              onClick={kakaoLogin}
              type="button"
              className="flex h-11 w-full items-center justify-center gap-[5px] rounded-lg bg-[#FEE500] p-2.5"
            >
              <IconKakaoLogo />
              <span className="text-black">카카오로 시작하기</span>
            </button>
          </div>
          <div className="mx-5 transition active:scale-95">
            <button
              onClick={() => router.push("/sign-up/email")}
              type="button"
              className="flex h-11 w-full items-center justify-center gap-[5px] rounded-lg bg-secondary p-2.5"
            >
              <IconEmailIcon />
              <span className="text-white">이메일로 시작하기</span>
            </button>
          </div>
          <div className="mx-5 transition active:scale-95">
            <button
              onClick={appleLogin}
              type="button"
              className="flex h-11 w-full items-center justify-center gap-[5px] rounded-lg bg-black p-2.5"
            >
              <IconAppleLogo />
              <span className="text-white">애플로 시작하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginContent;
