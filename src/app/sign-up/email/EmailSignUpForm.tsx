"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BlockBtn from "@/components/button/BlockBtn";
import { Input } from "@/components/ui/Inputa";
import { Label } from "@/components/ui/Label";
import { Progress } from "@/components/ui/Progress";

import usePostEmailSignUp from "@/api/auth/client/usePostEmailSignUp";
import { toast } from "@/lib/zustand/useToastStore";
import { IconCheckBlue, IconExpRed, IconEyeOff, IconEyeOn } from "@/public/svgs/ui";

const EmailSignUpForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [passwordsVisible, setPasswordsVisible] = useState<boolean>(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);

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
      toast.error("이메일을 입력해주세요.");
      return;
    }
    if (!password) {
      toast.error("비밀번호를 입력해주세요.");
      return;
    }
    if (!passwordConfirm) {
      toast.error("비밀번호 확인을 입력해주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    emailSignUpMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          router.push(`/sign-up?token=${data.signUpToken}`);
        },
        onError: (error: unknown) => {
          const axiosError = error as { response?: { data?: { message?: string } } };
          toast.error(axiosError.response?.data?.message || "회원가입에 실패했습니다.");
        },
      },
    );
  };

  return (
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

        <div className="mt-10 flex flex-col gap-5">
          <div>
            <Label htmlFor="email" className="text-k-900">
              이메일
            </Label>
            <Input
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
                  >
                    {passwordsVisible ? <IconEyeOn /> : <IconEyeOff />}
                  </button>
                </div>
              </div>
              {/* TODO: 이메일 주소 구조 검증 */}
              <div>
                <Label htmlFor="passwordConfirm" className="text-k-900">
                  비밀번호 확인
                </Label>
                <div className="relative">
                  <Input
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
                  >
                    {passwordsVisible ? <IconEyeOn /> : <IconEyeOff />}
                  </button>
                </div>
                {/* TODO: 비밀번호 요건 검증 */}

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
      </div>

      <div className="fixed bottom-14 w-full max-w-app bg-white">
        <div className="mb-[37px] px-5">
          <BlockBtn onClick={emailSignUp} disabled={!email || !password || !passwordConfirm || !passwordMatch}>
            다음
          </BlockBtn>
        </div>
      </div>
    </>
  );
};

export default EmailSignUpForm;
