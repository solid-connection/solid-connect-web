"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePostEmailAuth } from "@/apis/Auth";
import { IconArrowBackFilled, IconSolidConnectionFullBlackLogo } from "@/public/svgs";
import { IconAppleLogo, IconEmailIcon, IconKakaoLogo } from "@/public/svgs/auth";
import {
  AUTH_REDIRECT_PARAM,
  buildSignUpEmailPathWithRedirect,
  getSafeCommunityRedirectPath,
} from "@/utils/authRedirect";
import { appleLogin, kakaoLogin } from "@/utils/authUtils";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import useInputHandler from "./_hooks/useInputHandler";

const loginSchema = z.object({
  email: z.string().min(1, "이메일을 입력해주세요.").email("올바른 이메일 형식을 입력해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요.").min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = getSafeCommunityRedirectPath(searchParams?.get(AUTH_REDIRECT_PARAM)) ?? undefined;

  const { mutate: postEmailAuth, isPending } = usePostEmailAuth({ redirectPath });
  const { showPasswordField, handleEmailChange } = useInputHandler();
  const isDesktop = useIsDesktopViewport();

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

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  if (isDesktop === null) return null;

  const renderLoginForm = (fieldWrapperClassName: string) => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-3">
        <div className={fieldWrapperClassName}>
          <input
            type="email"
            placeholder="이메일"
            className="w-full rounded-lg border border-k-100 px-5 py-3 font-serif text-k-400 typo-regular-4 focus:outline-none"
            {...register("email", {
              onChange: handleEmailChange,
            })}
            onKeyDown={handleKeyDown}
          />
          {errors.email && <p className="mt-1 text-red-500 typo-regular-4">{errors.email.message}</p>}
        </div>

        <div
          className={`${fieldWrapperClassName} overflow-hidden transition-all duration-500 ease-in-out ${
            showPasswordField ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full rounded-lg border border-k-100 px-5 py-3 font-serif text-k-400 typo-regular-4 focus:outline-none"
            {...register("password")}
            onKeyDown={handleKeyDown}
          />
          {errors.password && <p className="mt-1 text-red-500 typo-regular-4">{errors.password.message}</p>}
        </div>

        <div className={`${fieldWrapperClassName} transition active:scale-95`}>
          <button
            type="submit"
            disabled={isPending}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-primary p-2.5 font-serif text-white typo-medium-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "로그인 중..." : "로그인"}
          </button>
        </div>
      </div>
    </form>
  );

  const renderSocialButtons = (fieldWrapperClassName: string) => (
    <div className="mt-3">
      <div className="text-center font-serif text-k-300 typo-medium-1">or</div>
      <div className="mt-3 flex flex-col gap-3">
        <div className={`${fieldWrapperClassName} transition active:scale-95`}>
          <button
            onClick={() => kakaoLogin(redirectPath)}
            type="button"
            className="flex h-11 w-full items-center justify-center gap-[5px] rounded-lg bg-accent-custom-yellow p-2.5"
          >
            <IconKakaoLogo />
            <span className="text-black">카카오로 시작하기</span>
          </button>
        </div>
        <div className={`${fieldWrapperClassName} transition active:scale-95`}>
          <button
            onClick={() => router.push(buildSignUpEmailPathWithRedirect(redirectPath))}
            type="button"
            className="flex h-11 w-full items-center justify-center gap-[5px] rounded-lg bg-secondary p-2.5"
          >
            <IconEmailIcon />
            <span className="text-white">이메일로 시작하기</span>
          </button>
        </div>
        <div className={`${fieldWrapperClassName} transition active:scale-95`}>
          <button
            onClick={() => appleLogin(redirectPath)}
            type="button"
            className="flex h-11 w-full items-center justify-center gap-[5px] rounded-lg bg-black p-2.5"
          >
            <IconAppleLogo />
            <span className="text-white">애플로 시작하기</span>
          </button>
        </div>
      </div>
    </div>
  );

  const desktopViewProps = {
    loginForm: renderLoginForm(""),
    socialButtons: renderSocialButtons(""),
  };
  const mobileViewProps = {
    loginForm: renderLoginForm("mx-5"),
    socialButtons: renderSocialButtons("mx-5"),
    handleBack,
  };

  return isDesktop ? <DesktopLoginView {...desktopViewProps} /> : <MobileLoginView {...mobileViewProps} />;
};

type DesktopLoginViewProps = {
  loginForm: React.ReactNode;
  socialButtons: React.ReactNode;
};

type MobileLoginViewProps = DesktopLoginViewProps & {
  handleBack: () => void;
};

const DesktopLoginView = ({ loginForm, socialButtons }: DesktopLoginViewProps) => (
  <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
    <div className="grid min-h-[calc(100vh-64px)] items-center gap-8 xl:grid-cols-[minmax(360px,440px)_minmax(420px,520px)] xl:justify-center">
      <aside className="rounded-lg border border-k-100 bg-white p-8">
        <Link href="/" aria-label="홈으로 이동">
          <IconSolidConnectionFullBlackLogo />
        </Link>
        <p className="mt-10 text-primary typo-sb-9">Solid Connection</p>
        <h1 className="mt-3 text-k-900 typo-bold-1">교환학생 여정을 이어가세요</h1>
        <p className="mt-4 text-k-500 typo-medium-2">
          학교 탐색부터 지원 준비, 멘토링과 커뮤니티까지 한 계정에서 관리할 수 있습니다.
        </p>
        <div className="mt-8 grid gap-3">
          {["관심 학교 저장", "지원 정보 관리", "멘토링 채팅"].map((item) => (
            <div key={item} className="rounded-lg bg-k-50 px-4 py-3 text-k-700 typo-medium-2">
              {item}
            </div>
          ))}
        </div>
      </aside>

      <section className="rounded-lg border border-k-100 bg-white p-8">
        <div>
          <p className="text-primary typo-sb-9">Login</p>
          <h2 className="mt-2 font-serif text-k-900 typo-bold-1">로그인</h2>
          <p className="mt-2 text-k-500 typo-medium-2">교환학생을 위한 여정을 지금 시작하세요.</p>
        </div>

        <div className="mt-8">
          {loginForm}
          {socialButtons}
        </div>
      </section>
    </div>
  </div>
);

const MobileLoginView = ({ loginForm, socialButtons, handleBack }: MobileLoginViewProps) => (
  <div>
    <div className="-mx-5 mt-[-56px] flex h-[77px] items-center gap-3 border-b border-bg-200 px-5">
      <button
        type="button"
        onClick={handleBack}
        className="flex h-6 w-6 shrink-0 items-center justify-center"
        aria-label="뒤로가기"
      >
        <IconArrowBackFilled />
      </button>
      <Link href="/" aria-label="홈으로 이동">
        <IconSolidConnectionFullBlackLogo />
      </Link>
    </div>
    <div className="h-[229px] pt-[90px]">
      <div className="text-center font-serif text-k-900 typo-sb-3">로그인</div>
      <div className="text-center font-serif text-k-300 typo-medium-4">
        교환학생을 위한 여정
        <br />
        지금 솔리드 커넥션에서 시작하세요.
      </div>
    </div>

    {loginForm}
    {socialButtons}
  </div>
);

export default LoginContent;
