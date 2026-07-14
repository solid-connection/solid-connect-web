"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type ChangeEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { useGetMyInfo, usePostConfirmSchoolEmail, usePostSchoolEmail } from "@/apis/MyPage";
import BlockBtn from "@/components/button/BlockBtn";
import { Input } from "@/components/ui/Inputa";
import { Label } from "@/components/ui/Label";
import { Progress } from "@/components/ui/Progress";
import { IconExpRed } from "@/public/svgs/ui";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import { getSchoolEmailReturnPath } from "../../_lib/returnTo";

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
  const searchParams = useSearchParams();
  const isDesktop = useIsDesktopViewport(false);
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
  const returnPath = getSchoolEmailReturnPath(searchParams?.get("returnTo"));

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

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
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
    const buttonLabel = returnPath === "/" ? "홈으로" : "이전 화면으로 돌아가기";
    const doneViewProps = {
      buttonLabel,
      onReturnClick: () => router.replace(returnPath),
    };

    return isDesktop ? (
      <DesktopSchoolEmailDoneView {...doneViewProps} />
    ) : (
      <MobileSchoolEmailDoneView {...doneViewProps} />
    );
  }

  const formViewProps: SchoolEmailFormViewProps = {
    step,
    progressValue,
    schoolEmail,
    code,
    remainingSeconds,
    emailErrorMessage,
    codeErrorMessage,
    isEmailInputValid,
    isCodeInputValid,
    isTimerExpired,
    isSendingEmail: postSchoolEmailMutation.isPending,
    isConfirmingCode: postConfirmSchoolEmailMutation.isPending,
    setSchoolEmail,
    setEmailErrorMessage,
    handleCodeChange,
    sendVerificationEmail,
    confirmVerificationCode,
    renderErrorMessage,
  };

  return isDesktop ? (
    <DesktopSchoolEmailFormView {...formViewProps} />
  ) : (
    <MobileSchoolEmailFormView {...formViewProps} />
  );
};

type SchoolEmailDoneViewProps = {
  buttonLabel: string;
  onReturnClick: () => void;
};

const DesktopSchoolEmailDoneView = ({ buttonLabel, onReturnClick }: SchoolEmailDoneViewProps) => (
  <div className="desktop-page-shell">
    <header className="mb-8">
      <p className="text-primary typo-sb-9">My Solid</p>
      <h1 className="mt-2 text-k-900 typo-bold-1">학교 인증</h1>
      <p className="mt-2 text-k-500 typo-medium-2">학교 이메일 인증이 완료되었습니다.</p>
    </header>

    <section className="flex min-h-[520px] flex-col items-center justify-center rounded-lg border border-k-100 bg-white p-8 text-center">
      <div className="mb-6 flex h-[120px] w-[120px] items-center justify-center rounded-full border-[10px] border-secondary">
        <div className="h-10 w-16 -rotate-45 border-b-[10px] border-l-[10px] border-secondary" />
      </div>
      <h2 className="text-k-800 typo-bold-1">
        학교 인증이 <span className="text-secondary">완료</span>되었어요!
      </h2>
      <p className="mt-3 text-k-500 typo-medium-2">인증된 학교 정보를 기반으로 솔리드 커넥션을 이용할 수 있어요.</p>
      <div className="mt-10 w-full max-w-sm">
        <BlockBtn onClick={onReturnClick}>{buttonLabel}</BlockBtn>
      </div>
    </section>
  </div>
);

const MobileSchoolEmailDoneView = ({ buttonLabel, onReturnClick }: SchoolEmailDoneViewProps) => (
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
        <BlockBtn onClick={onReturnClick}>{buttonLabel}</BlockBtn>
      </div>
    </div>
  </div>
);

type SchoolEmailFormViewProps = {
  step: VerificationStep;
  progressValue: number;
  schoolEmail: string;
  code: string;
  remainingSeconds: number;
  emailErrorMessage: string;
  codeErrorMessage: string;
  isEmailInputValid: boolean;
  isCodeInputValid: boolean;
  isTimerExpired: boolean;
  isSendingEmail: boolean;
  isConfirmingCode: boolean;
  setSchoolEmail: (value: string) => void;
  setEmailErrorMessage: (value: string) => void;
  handleCodeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  sendVerificationEmail: () => void;
  confirmVerificationCode: () => void;
  renderErrorMessage: (message: string) => ReactNode;
};

const SchoolEmailFields = ({
  step,
  schoolEmail,
  code,
  remainingSeconds,
  emailErrorMessage,
  codeErrorMessage,
  isSendingEmail,
  setSchoolEmail,
  setEmailErrorMessage,
  handleCodeChange,
  sendVerificationEmail,
  renderErrorMessage,
  idPrefix,
}: SchoolEmailFormViewProps & { idPrefix: "desktop" | "mobile" }) => (
  <div className="mt-8 flex flex-col gap-5">
    <div>
      <Label htmlFor={`${idPrefix}SchoolEmail`} className="text-k-900">
        학교 이메일
      </Label>
      <Input
        id={`${idPrefix}SchoolEmail`}
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
        <Label htmlFor={`${idPrefix}VerificationCode`} className="text-k-900">
          인증번호
        </Label>
        <div className="relative">
          <Input
            id={`${idPrefix}VerificationCode`}
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
            disabled={isSendingEmail}
            className="text-k-700 underline disabled:text-k-300"
          >
            재발송
          </button>
        </div>
      </div>
    )}
  </div>
);

const SchoolEmailActionButton = ({
  step,
  isEmailInputValid,
  isCodeInputValid,
  isTimerExpired,
  isSendingEmail,
  isConfirmingCode,
  sendVerificationEmail,
  confirmVerificationCode,
}: SchoolEmailFormViewProps) =>
  step === "email" ? (
    <BlockBtn onClick={sendVerificationEmail} disabled={!isEmailInputValid || isSendingEmail}>
      인증번호 보내기
    </BlockBtn>
  ) : (
    <BlockBtn onClick={confirmVerificationCode} disabled={!isCodeInputValid || isTimerExpired || isConfirmingCode}>
      인증하기
    </BlockBtn>
  );

const DesktopSchoolEmailFormView = (props: SchoolEmailFormViewProps) => (
  <div className="desktop-page-shell">
    <header className="mb-8">
      <p className="text-primary typo-sb-9">My Solid</p>
      <h1 className="mt-2 text-k-900 typo-bold-1">학교 인증</h1>
      <p className="mt-2 text-k-500 typo-medium-2">학교 이메일로 소속 대학을 인증하세요.</p>
    </header>

    <div className="grid items-start gap-8 xl:grid-cols-[minmax(420px,640px)_minmax(280px,360px)]">
      <section className="rounded-lg border border-k-100 bg-white p-6">
        <Progress value={props.progressValue} showPercentage={false} />

        <div className="mt-8">
          <h2 className="text-k-900 typo-bold-2">
            {props.step === "email" ? "학교 이메일을 통해" : "이메일로 발송한"}
            <br />
            {props.step === "email" ? "학교 인증을 진행해주세요" : "인증번호를 입력해주세요"}
          </h2>
        </div>

        <SchoolEmailFields {...props} idPrefix="desktop" />

        <div className="mt-10">
          <SchoolEmailActionButton {...props} />
        </div>
      </section>

      <aside className="desktop-sticky-panel rounded-lg border border-k-100 bg-white p-6">
        <h2 className="text-k-900 typo-bold-4">인증 안내</h2>
        <div className="mt-5 space-y-4 text-k-600 typo-medium-3">
          <p>학교 도메인의 이메일 주소로 인증번호를 받을 수 있어요.</p>
          <p>인증번호는 5분 동안 유효하며, 만료되면 다시 발송해주세요.</p>
        </div>
      </aside>
    </div>
  </div>
);

const MobileSchoolEmailFormView = (props: SchoolEmailFormViewProps) => (
  <div className="min-h-[calc(100dvh-3.5rem)] px-5 pt-10">
    <Progress value={props.progressValue} showPercentage={false} className="mt-4" />

    <div className="mt-10">
      <h1 className="text-k-900 typo-bold-1">
        {props.step === "email" ? "학교 이메일을 통해" : "이메일로 발송한"}
        <br />
        {props.step === "email" ? "학교 인증을 진행해주세요" : "인증번호를 입력해주세요"}
      </h1>
    </div>

    <SchoolEmailFields {...props} idPrefix="mobile" />

    <div className="fixed bottom-14 left-0 right-0 w-full bg-white">
      <div className="mx-auto mb-[37px] w-full max-w-app px-5">
        <SchoolEmailActionButton {...props} />
      </div>
    </div>
  </div>
);

export default SchoolEmailVerificationContent;
