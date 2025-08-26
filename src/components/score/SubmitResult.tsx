import React from "react";

import clsx from "clsx";

import { IconCheck } from "@/public/svgs/mentor";

// --- Props 타입 정의 ---

// 정보 행의 타입
export interface InfoRowProps {
  label: string;
  status: string;
  statusColor?: string; // Tailwind CSS 색상 클래스 (e.g., 'text-blue-600')
  details?: string;
}

// 메인 컴포넌트의 Props
interface SubmitResultProps {
  title: string;
  description: string;
  infoRows: InfoRowProps[];
  buttonText: string;
  onClick?: () => void;
  handleClose?: () => void;
}

// --- 메인 컴포넌트 ---
const SubmitResult = ({ title, description, infoRows, buttonText, onClick, handleClose }: SubmitResultProps) => {
  return (
    <div className="font-sans flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* 상단 아이콘 및 텍스트 */}
        <div className="mb-8 flex flex-col items-center">
          <IconCheck />
          <h1 className="mt-4 text-2xl font-bold text-gray-800">{title}</h1>
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        </div>

        {/* 정보 카드 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          <div className="space-y-2">
            {infoRows.map((row, index) => (
              <div
                key={row.label}
                className={clsx(
                  "flex items-center justify-between px-4 py-5 text-sm",
                  index < infoRows.length - 1 && "border-b border-gray-100",
                )}
              >
                <span className="font-medium text-gray-600">{row.label}</span>
                <div className="flex items-center gap-3">
                  <span className={clsx("font-semibold", row.statusColor || "text-gray-900")}>{row.status}</span>
                  {row.details && <span className="text-gray-400">{row.details}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            onClick={handleClose}
            className="w-full rounded-lg border border-primary bg-primary-100 py-3 font-semibold text-primary"
          >
            닫기
          </button>
          <button onClick={onClick} className="w-full rounded-lg bg-primary py-3 font-semibold text-white">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 컴포넌트 사용 예시 ---
const ExamplePage = () => {
  const infoRows = [
    {
      label: "공인어학",
      status: "TOEIC",
      details: "480/500",
    },
    {
      label: "어학증명서",
      status: "제출 완료",
      statusColor: "text-blue-600",
      details: "증명서.pdf",
    },
  ];

  return (
    <SubmitResult
      title={"어학 성적 입력 완료"}
      description={"지원은 총 3번만 가능하며, 제출 완료 후 성적을 변경 하실 수 없습니다."}
      infoRows={infoRows}
      buttonText={"학점 입력하기"}
    />
  );
};

export default SubmitResult;
