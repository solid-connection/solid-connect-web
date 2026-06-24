"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useGetMyInfo, usePostConfirmSchoolEmail, usePostSchoolEmail } from "@/apis/MyPage";
import BlockBtn from "@/components/button/BlockBtn";
import { Input } from "@/components/ui/Inputa";
import { Label } from "@/components/ui/Label";
import { Progress } from "@/components/ui/Progress";
import { IconExpRed } from "@/public/svgs/ui";

const VERIFICATION_LIMIT_SECONDS = 300;
const CODE_LENGTH = 6;

type VerificationStep = "email" | "code" | "done";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const restSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${restSeconds}`;
};

const SchoolEmailVerificationContent = () => {
  const router = useRouter();
  const { data: myInfo } = useGetMyInfo();
  const postSchoolEmailMutation = usePostSchoolEmail();
  const postConfirmSchoolEmailMutation = usePostConfirmSchoolEmail();

  const [step, setStep] = useState<VerificationStep>("email");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [code, setCode] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(VERIFICATION_LIMIT_SECONDS);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [codeErrorMessage, setCodeErrorMessage] = useState("");

  const isEmailInputValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolEmail);
  }, [schoolEmail]);
  const isCodeInputValid = code.length === CODE_LENGTH;
  const isTimerExpired = remainingSeconds <= 0;
  const progressValue = step === "email" ? 0 : step === "code" ? 50 : 100;

  useEffect(() => {
    if (step !== "code" || remainingSeconds <= 0) return;

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((prevSeconds) => Math.max(prevSeconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [remainingSeconds, step]);

  useEffect(() => {
    if (myInfo?.homeUniversityName) {
      setStep("done");
    }
  }, [myInfo?.homeUniversityName]);

  const sendVerificationEmail = () => {
    if (!isEmailInputValid) {
      setEmailErrorMessage("올바르지 않은 이메일 주소입니다.");
      return;
    }

    postSchoolEmailMutation.mutate(
      { schoolEmail },
      {
        onSuccess: () => {
          setStep("code");
          setCode("");
          setEmailErrorMessage("");
          setCodeErrorMessage("");
          setRemainingSeconds(VERIFICATION_LIMIT_SECONDS);
        },
        onError: () => {
          setEmailErrorMessage("올바르지 않은 이메일 주소입니다.");
        },
      },
    );
  };

  const confirmVerificationCode = () => {
    if (!isCodeInputValid || isTimerExpired) {
      setCodeErrorMessage("올바르지 않은 인증번호입니다.");
      return;
    }

    postConfirmSchoolEmailMutation.mutate(
      { code },
      {
        onSuccess: () => {
          setCodeErrorMessage("");
          setStep("done");
        },
        onError: () => {
          setCodeErrorMessage("올바르지 않은 인증번호입니다.");
        },
      },
    );
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH));
    setCodeErrorMessage("");
  };

  const renderErrorMessage = (message: string) => {
    return (
      <span className="mt-2 flex items-center gap-1">
        <IconExpRed />
        <p className="text-accent-custom-red typo-regular-4">{message}</p>
      </span>
    );
  };

  if (step === "done") {
    return (
      <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col px-5">
        <div className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
          <div className="mb-6 flex h-[120px] w-[120px] items-center justify-center rounded-full border-[10px] border-secondary">
            <div className="h-10 w-16 -rotate-45 border-b-[10px] border-l-[10px] border-secondary" />
          </div>
          <h1 className="text-center text-k-800 typo-bold-3">
            학교 인증이
            <br />
            <span className="text-secondary">완료</span>되었어요!
          </h1>
        </div>

        <div className="fixed bottom-14 left-0 right-0 w-full bg-white">
          <div className="mx-auto mb-[37px] w-full max-w-app px-5">
            <BlockBtn onClick={() => router.replace("/")}>홈으로</BlockBtn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] px-5 pt-10">
      <Progress value={progressValue} showPercentage={false} className="mt-4" />

      <div className="mt-10">
        <h1 className="text-k-900 typo-bold-1">
          {step === "email" ? "학교 이메일을 통해" : "이메일로 발송한"}
          <br />
          {step === "email" ? "학교 인증을 진행해주세요" : "인증번호를 입력해주세요"}
        </h1>
      </div>

      <div className="mt-10 flex flex-col gap-5">
        <div>
          <Label htmlFor="schoolEmail" className="text-k-900">
            학교 이메일
          </Label>
          <Input
            id="schoolEmail"
            variant="gray"
            placeholder="ID@example.com"
            type="email"
            autoComplete="email"
            value={schoolEmail}
            disabled={step === "code"}
            onChange={(event) => {
              setSchoolEmail(event.target.value);
              setEmailErrorMessage("");
            }}
          />
          {emailErrorMessage && renderErrorMessage(emailErrorMessage)}
        </div>

        {step === "code" && (
          <div>
            <Label htmlFor="verificationCode" className="text-k-900">
              인증번호
            </Label>
            <div className="relative">
              <Input
                id="verificationCode"
                variant="gray"
                placeholder="인증번호 6자리 입력"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={handleCodeChange}
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary typo-medium-4">
                {formatTime(remainingSeconds)}
              </span>
            </div>
            {codeErrorMessage && renderErrorMessage(codeErrorMessage)}
            <div className="mt-3 flex items-center justify-center gap-2 typo-sb-9">
              <span className="text-k-400">인증번호가 오지 않는다면?</span>
              <button
                type="button"
                onClick={sendVerificationEmail}
                disabled={postSchoolEmailMutation.isPending}
                className="text-k-700 underline disabled:text-k-300"
              >
                재발송
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-14 left-0 right-0 w-full bg-white">
        <div className="mx-auto mb-[37px] w-full max-w-app px-5">
          {step === "email" ? (
            <BlockBtn
              onClick={sendVerificationEmail}
              disabled={!isEmailInputValid || postSchoolEmailMutation.isPending}
            >
              인증번호 보내기
            </BlockBtn>
          ) : (
            <BlockBtn
              onClick={confirmVerificationCode}
              disabled={!isCodeInputValid || isTimerExpired || postConfirmSchoolEmailMutation.isPending}
            >
              인증하기
            </BlockBtn>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolEmailVerificationContent;
