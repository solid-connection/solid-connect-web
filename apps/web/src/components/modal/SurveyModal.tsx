"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ModalBase from "./ModalBase";

type SurveyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCloseForWeek: () => void;
};

const SurveyModal = ({ isOpen, onClose, onCloseForWeek }: SurveyModalProps) => {
  const [dontShowForWeek, setDontShowForWeek] = useState(false);
  const surveyUrl = "https://forms.gle/BtdziNrV7gRPLpDt5";

  // 모달이 열릴 때마다 체크박스 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setDontShowForWeek(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (dontShowForWeek) {
      onCloseForWeek();
    } else {
      onClose();
    }
  };

  const handleSurveyClick = () => {
    try {
      const newWindow = window.open(surveyUrl, "_blank", "noopener,noreferrer");

      if (!newWindow) {
        // 팝업이 차단된 경우
        toast.error(`팝업 차단으로 설문을 열 수 없습니다. 새 탭에서 수동으로 ${surveyUrl} 를 열어주세요.`);
      }
    } catch (error) {
      // 예외 발생 시
      toast.error(`설문 링크를 열 수 없습니다. 수동으로 ${surveyUrl} 를 열어주세요.`);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={handleClose}>
      <div className="relative h-[450px] w-[290px] overflow-hidden rounded-[8px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] [text-size-adjust:100%] [-webkit-text-size-adjust:100%]">
        <Image
          src="/images/survey-modal/bg-vector.svg"
          alt=""
          aria-hidden
          width={368}
          height={265}
          className="pointer-events-none absolute -left-[9px] top-[15px] h-[265.34px] w-[367.79px] rotate-[0.85deg]"
        />

        <Image
          src="/images/survey-modal/top-logo.svg"
          alt=""
          aria-hidden
          width={109}
          height={26}
          className="pointer-events-none absolute left-[91px] top-[33px]"
        />

        <div className="pointer-events-none absolute left-1/2 top-[92px] w-[182px] -translate-x-1/2 text-center leading-[1.3]">
          <p className="whitespace-nowrap bg-gradient-to-r from-[#007AFF] to-[#51298A] bg-clip-text text-[23px] font-bold text-transparent">
            솔리드 커넥션,
          </p>
          <p className="whitespace-nowrap bg-gradient-to-r from-[#007AFF] to-[#430895] bg-clip-text text-[40px] font-extrabold text-transparent">
            26-2학기
          </p>
          <p className="whitespace-nowrap bg-gradient-to-r from-[#007AFF] to-[#430895] bg-clip-text text-[40px] font-extrabold text-transparent">
            만족도 조사
          </p>
        </div>

        <p className="absolute left-1/2 top-[246px] w-[228px] -translate-x-1/2 text-center text-[12px] font-semibold leading-[1.5] text-[#29428A]">
          1분 설문조사하고 멘토링과 커피쿠폰 받아가세요!
        </p>

        <button
          onClick={handleSurveyClick}
          type="button"
          className="absolute left-1/2 top-[290px] flex h-[33px] w-[160px] -translate-x-1/2 items-center justify-center gap-[5px] rounded-[20px] bg-[#007AFF] transition-colors hover:bg-[#006CE0]"
        >
          <span className="whitespace-nowrap text-[13px] font-semibold leading-none text-white">설문조사 하러가기</span>
          <Image
            src="/images/survey-modal/arrow-right.svg"
            alt=""
            aria-hidden
            width={15}
            height={15}
            className="pointer-events-none"
          />
        </button>

        <div className="absolute left-1/2 top-[337px] w-[230px] -translate-x-1/2 text-center text-[11px] font-medium leading-[1.5] text-[#5F6268]">
          <p className="font-bold">2026년 3월 14일~ 3월 31일</p>
          <p>추첨을 통해 커피 쿠폰 또는 멘토링 기회를 제공해요🍀</p>
        </div>

        <div className="absolute bottom-0 left-0 flex h-[44px] w-full items-center justify-between border-t-[0.5px] border-[#D0D0D0] px-[19px]">
          <label className="flex cursor-pointer select-none items-center gap-[5px]">
            <input
              type="checkbox"
              checked={dontShowForWeek}
              onChange={(e) => setDontShowForWeek(e.target.checked)}
              className="sr-only"
            />
            <span className="relative h-[22px] w-[22px]">
              <Image
                src="/images/survey-modal/checkbox-circle.svg"
                alt=""
                aria-hidden
                fill
                className="object-contain"
              />
              <svg
                viewBox="0 0 12 12"
                className={`absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-[#5F6268] transition-opacity ${
                  dontShowForWeek ? "opacity-100" : "opacity-0"
                }`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M2 6.2L4.6 8.6L10 3.4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-[12px] font-normal leading-none text-[#5F6268]">일주일간 보지않기</span>
          </label>

          <button onClick={handleClose} type="button" className="text-[12px] font-normal leading-none text-[#5F6268]">
            닫기
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default SurveyModal;
