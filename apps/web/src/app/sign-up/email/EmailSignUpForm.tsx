"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePostEmailSignUp } from "@/apis/Auth";
import BlockBtn from "@/components/button/BlockBtn";
import { Input } from "@/components/ui/Inputa";
import { Label } from "@/components/ui/Label";
import { Progress } from "@/components/ui/Progress";
import { showIconToast } from "@/lib/toast/showIconToast";
import { IconCheckBlue, IconExpRed, IconEyeOff, IconEyeOn } from "@/public/svgs/ui";
import { AUTH_REDIRECT_PARAM, buildSignUpPath, getSafeCommunityRedirectPath } from "@/utils/authRedirect";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";

const EmailSignUpForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = getSafeCommunityRedirectPath(searchParams?.get(AUTH_REDIRECT_PARAM)) ?? undefined;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [passwordsVisible, setPasswordsVisible] = useState<boolean>(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const isDesktop = useIsDesktopViewport();

  const emailSignUpMutation = usePostEmailSignUp();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!showPassword) {
      setCurrentStep(1);
      setShowPassword(true);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordsVisible(!passwordsVisible);
  };

  useEffect(() => {
    if (passwordConfirm.length > 0) {
      setCurrentStep(2);
    }

    if (passwordConfirm === "") {
      setPasswordMatch(null);
      return;
    }

    setPasswordMatch(password === passwordConfirm);
  }, [password, passwordConfirm]);

  const emailSignUp = async () => {
    if (!email) {
      showIconToast("logo", "이메일을 입력해주세요.");
      return;
    }
    if (!password) {
      showIconToast("logo", "비밀번호를 입력해주세요.");
      return;
    }
    if (!passwordConfirm) {
      showIconToast("logo", "비밀번호 확인을 입력해주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      showIconToast("logo", "비밀번호가 일치하지 않습니다.");
      return;
    }

    emailSignUpMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          router.push(buildSignUpPath({ signUpToken: data.signUpToken, redirectPath }));
        },
      },
    );
  };

  if (isDesktop === null) return null;

  const formFields = (
    <div className="mt-10 flex flex-col gap-5">
      <div>
        <Label htmlFor="email" className="text-k-900">
          이메일
        </Label>
        <Input
          id="email"
          variant="gray"
          placeholder="ID@example.com"
          type="email"
          autoComplete="email"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      {showPassword && (
        <>
          <div>
            <Label htmlFor="password" className="text-k-900">
              비밀번호
            </Label>
            <div className="relative">
              <Input
                id="password"
                variant="gray"
                placeholder="비밀번호를 입력해주세요"
                type={passwordsVisible ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3.5 top-1/2 -translate-y-1/2"
                aria-label={passwordsVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {passwordsVisible ? <IconEyeOn /> : <IconEyeOff />}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="passwordConfirm" className="text-k-900">
              비밀번호 확인
            </Label>
            <div className="relative">
              <Input
                id="passwordConfirm"
                variant="gray"
                placeholder="비밀번호를 다시 입력해주세요"
                type={passwordsVisible ? "text" : "password"}
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3.5 top-1/2 -translate-y-1/2"
                aria-label={passwordsVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {passwordsVisible ? <IconEyeOn /> : <IconEyeOff />}
              </button>
            </div>

            {passwordConfirm !== "" && (
              <div className="mt-1">
                {passwordMatch ? (
                  <span className="flex items-center gap-1">
                    <IconCheckBlue />
                    <p className="text-sub-a typo-regular-4">입력한 비밀번호와 동일합니다.</p>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <IconExpRed />
                    <p className="text-accent-custom-red typo-regular-4">입력한 비밀번호와 동일하지 않습니다.</p>
                  </span>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  const submitButton = (
    <BlockBtn onClick={emailSignUp} disabled={!email || !password || !passwordConfirm || !passwordMatch}>
      다음
    </BlockBtn>
  );

  const viewProps = {
    currentStep,
    formFields,
    submitButton,
  };

  return isDesktop ? <DesktopEmailSignUpView {...viewProps} /> : <MobileEmailSignUpView {...viewProps} />;
};

type EmailSignUpViewProps = {
  currentStep: number;
  formFields: React.ReactNode;
  submitButton: React.ReactNode;
};

const DesktopEmailSignUpView = ({ currentStep, formFields, submitButton }: EmailSignUpViewProps) => (
  <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
    <div className="grid min-h-[calc(100vh-64px)] items-center gap-8 xl:grid-cols-[minmax(420px,520px)_minmax(300px,380px)] xl:justify-center">
      <section className="rounded-lg border border-k-100 bg-white p-8">
        <p className="text-primary typo-sb-9">Sign up</p>
        <h1 className="mt-2 text-k-900 typo-bold-1">이메일로 시작하기</h1>
        <p className="mt-2 text-k-500 typo-medium-2">이메일과 비밀번호를 입력해 솔커 계정을 만들어보세요.</p>

        <Progress value={currentStep * 50} showPercentage={true} className="mt-8" />
        {formFields}
        <div className="mt-8">{submitButton}</div>
      </section>

      <aside className="rounded-lg border border-k-100 bg-white p-6">
        <h2 className="text-k-900 typo-bold-4">가입 단계</h2>
        <div className="mt-5 grid gap-3">
          {["이메일 입력", "비밀번호 설정", "프로필 완성"].map((item, index) => (
            <div
              key={item}
              className={`rounded-lg px-4 py-3 typo-medium-2 ${
                currentStep >= index ? "bg-primary-100 text-primary" : "bg-k-50 text-k-500"
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      </aside>
    </div>
  </div>
);

const MobileEmailSignUpView = ({ currentStep, formFields, submitButton }: EmailSignUpViewProps) => (
  <>
    <div className="px-5 pt-2.5">
      <Progress value={currentStep * 50} showPercentage={true} className="mt-4" />
      <div className="mt-10">
        <span className="text-k-900 typo-bold-1">
          이메일을
          <br />
          입력해주세요
        </span>
      </div>

      {formFields}
    </div>

    <div className="fixed bottom-14 w-full max-w-app bg-white md:bottom-0 md:left-[88px] md:w-[calc(100%-88px)] md:max-w-none">
      <div className="mb-[37px] px-5">{submitButton}</div>
    </div>
  </>
);

export default EmailSignUpForm;
