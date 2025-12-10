"use client";

import { useEffect, useState } from "react";

import ModalBase from "./ModalBase";

import { toast } from "@/lib/zustand/useToastStore";

type SurveyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCloseForWeek: () => void;
};

const SurveyModal = ({ isOpen, onClose, onCloseForWeek }: SurveyModalProps) => {
  const [dontShowForWeek, setDontShowForWeek] = useState(false);

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
      const newWindow = window.open("https://forms.gle/MgygciRxAqfXSWJb6", "_blank", "noopener,noreferrer");

      if (!newWindow) {
        // 팝업이 차단된 경우
        toast.error(
          "팝업 차단으로 설문을 열 수 없습니다. 새 탭에서 수동으로 https://forms.gle/MgygciRxAqfXSWJb6 를 열어주세요.",
        );
      }
    } catch (error) {
      // 예외 발생 시
      console.error("Failed to open survey:", error);
      toast.error("설문 링크를 열 수 없습니다. 수동으로 https://forms.gle/MgygciRxAqfXSWJb6 를 열어주세요.");
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={handleClose}>
      <div className="flex justify-center">
        <div className="w-[80%] overflow-hidden rounded-lg shadow-lg">
          {/* 파란색 그라디언트 헤더 */}
          <div className="relative bg-gradient-to-br from-blue-gradient-from via-blue-gradient-via to-blue-gradient-to px-5 pb-6 pt-6">
            {/* 배경 장식 원들 */}
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-gradient-accent opacity-30 blur-3xl" />
            <div className="w 24 absolute -right-4 bottom-0 h-24 rounded-full bg-blue-gradient-to opacity-40 blur-2xl" />

            <div className="relative z-10">
              <div className="mb-2 typo-bold-2 text-white">
                교환학생 지원 결과 안내 &<br />
                만족도 조사
              </div>
              <div className="typo-medium-4 text-white/90">더욱 풍부한 콘텐츠와 혜택을 기대하세요!</div>

              {/* 자세히 보기 버튼 */}
              <button
                onClick={handleSurveyClick}
                className="mt-4 flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-4 py-2 backdrop-blur-sm transition-all hover:bg-white/20"
                type="button"
              >
                <span className="typo-sb-11 text-white">자세히 보기</span>
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 하단 영역 */}
          <div className="max-h-[50vh] overflow-y-auto bg-white px-4 py-3">
            <div className="space-y-2 typo-regular-5 text-gray-600">
              <p>안녕하세요, 솔커 모의지원을 이용해 주신 여러분! 💙</p>

              <p>드디어 기다리던 지원 결과가 공개되었습니다. 여기까지 준비해온 여러분 모두 고생 많으셨습니다 👏👏</p>

              <p>
                더 나은 서비스 제공을 위해 여러분의 소중한 피드백이 필요합니다. 피드백 남겨주시고 커피 쿠폰 받아가세요
                ☕️
              </p>

              <div className="rounded-lg bg-blue-50 p-3">
                <p className="mb-1 typo-sb-12 text-gray-800">👉 만족도 조사 참여하기</p>
                <p className="typo-regular-6 text-gray-600">• 소요 시간: 약 3분</p>
                <p className="typo-regular-6 text-gray-600">• 응답 기한: 10월 31까지</p>
              </div>

              <p className="text-center typo-regular-6 italic text-gray-500">
                결과와 관계없이 지금까지의 노력이 큰 의미가 있습니다.
                <br />
                솔커가 진심으로 응원합니다! 🌟 🚀✨
              </p>
            </div>
          </div>

          {/* 하단 컨트롤 */}
          <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-2.5">
            <label className="flex cursor-pointer items-center gap-1.5">
              <input
                type="checkbox"
                checked={dontShowForWeek}
                onChange={(e) => setDontShowForWeek(e.target.checked)}
                className="h-3.5 w-3.5 cursor-pointer rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="typo-regular-6 text-gray-600">일주일간 보지 않기</span>
            </label>

            <button
              onClick={handleClose}
              className="rounded-lg px-3 py-1 typo-medium-4 text-gray-700 transition-colors hover:bg-gray-100"
              type="button"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  );
};

export default SurveyModal;
