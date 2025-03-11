"use client";

import { useEffect, useState } from "react";

import BlockBtn from "@/components/button/BlockBtn";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Progress } from "@/components/ui/Progress";
import ProgressBar from "@/components/ui/ProgressBar";

import { IconCheckBlue, IconExpRed, IconEyeOff, IconEyeOn } from "@/public/svgs/ui";

const EmailSignUpForm = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [passwordsVisible, setPasswordsVisible] = useState<boolean>(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!showPassword) {
      setShowPassword(true);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordsVisible(!passwordsVisible);
  };

  useEffect(() => {
    if (passwordConfirm === "") {
      setPasswordMatch(null);
      return;
    }

    setPasswordMatch(password === passwordConfirm);
  }, [password, passwordConfirm]);

  return (
    <>
      <div className="px-5 pt-2.5">
        <Progress value={currentStep * 50} showPercentage={true} className="mt-4" />
        <ProgressBar currentStep={currentStep} totalSteps={2} />
        <div className="mt-10">
          <span className="text-2xl font-bold leading-[1.4] text-k-900">
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

                {passwordConfirm !== "" && (
                  <div className="mt-1">
                    {passwordMatch ? (
                      <span className="flex items-center gap-1">
                        <IconCheckBlue />
                        <p className="text-xs text-sub-a">입력한 비밀번호와 동일합니다.</p>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <IconExpRed />
                        <p className="text-xs text-[#E22A2D]">입력한 비밀번호와 동일하지 않습니다.</p>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="fixed bottom-14 w-full max-w-[600px] bg-white">
        <div className="mb-[37px] px-5">
          <BlockBtn onClick={() => {}}>다음</BlockBtn>
        </div>
      </div>
    </>
  );
};

export default EmailSignUpForm;
