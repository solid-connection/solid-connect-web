"use client";

import { useEffect, useState } from "react";
import { toast } from "@/lib/zustand/useToastStore";
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
      console.error("Failed to open survey:", error);
      toast.error(`설문 링크를 열 수 없습니다. 수동으로 ${surveyUrl} 를 열어주세요.`);
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
            <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-blue-gradient-to opacity-40 blur-2xl" />

            <div className="relative z-10">
              <div className="mb-2 text-white typo-bold-2">서비스 경험 만족도 조사</div>
              <div className="text-white/90 typo-medium-4">더 나은 솔리드 커넥션을 위해 의견을 들려주세요.</div>

              {/* 자세히 보기 버튼 */}
              <button
                onClick={handleSurveyClick}
                className="mt-4 flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-4 py-2 backdrop-blur-sm transition-all hover:bg-white/20"
                type="button"
              >
                <span className="text-white typo-sb-11">설문 바로가기</span>
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
            <div className="space-y-2 text-gray-600 typo-regular-5">
              <p>안녕하세요 !</p>

              <p>
                교환학생 지원 학생들을 대상으로 성적 공유 시스템을 지원하는 교환학생 플랫폼 솔리드 커넥션 입니다.
                <br />
                지난 학기 저희 서비스를 이용해주셔서 감사합니다.
              </p>

              <p>
                2024년 1학기 성적공유 서비스를 시작으로, 멘토링과 커뮤니티 기능을 확장을 목표로 서비스를 고도화하고
                있습니다.
                <br />
                따라서 서비스 경험 만족도와 피드백을 수집하고자 설문조사를 실시하게 되었습니다.
              </p>

              <p>
                저희는 귀하의 소중한 피드백이 더 나은 서비스를 만드는 데 큰 도움이 된다고 믿습니다.
                <br />
                이번 설문조사는 익명으로 진행되며, 솔직한 의견을 통해 저희가 어떤 점을 개선해야 할지 알 수 있게 됩니다.
              </p>

              <p>
                또한 3월 31일까지 설문조사를 참여하신 분 중 3분께 커피 기프티콘 또는 교환학생 멘토 Meet-up 기회를
                제공합니다!
              </p>

              <p>
                여러분의 작은 참여가 앞으로 많은 학생들에게 큰 변화를 가져올 수 있습니다.
                <br />
                <a
                  href="https://www.solid-connect.net/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  https://www.solid-connect.net/
                </a>
              </p>

              <p>
                함께 더 나은 미래를 만들어 주세요.
                <br />
                감사합니다 🙂
                <br />
                <a href={surveyUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  {surveyUrl}
                </a>
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
              <span className="text-gray-600 typo-regular-6">일주일간 보지 않기</span>
            </label>

            <button
              onClick={handleClose}
              className="rounded-lg px-3 py-1 text-gray-700 transition-colors typo-medium-4 hover:bg-gray-100"
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
