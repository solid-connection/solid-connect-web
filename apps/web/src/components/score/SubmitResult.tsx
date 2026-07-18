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
const SubmitResultBase = ({
  title,
  description,
  infoRows,
  buttonText,
  onClick,
  handleClose,
  isDesktop,
}: SubmitResultProps & { isDesktop: boolean }) => {
  const content = (
    <div className="w-full max-w-md text-center">
      <div className="mb-8 flex flex-col items-center">
        <IconCheck />
        <h1 className="mt-4 text-gray-800 typo-bold-1">{title}</h1>
        <p className="mt-2 text-gray-500 typo-regular-2">{description}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
        <div className="space-y-2">
          {infoRows.map((row, index) => (
            <div
              key={row.label}
              className={clsx(
                "flex items-center justify-between px-4 py-5 typo-regular-2",
                index < infoRows.length - 1 && "border-b border-gray-100",
              )}
            >
              <span className="text-gray-600 typo-medium-2">{row.label}</span>
              <div className="flex min-w-0 items-center gap-3 pl-4">
                <span className={clsx("shrink-0 typo-sb-9", row.statusColor || "text-gray-900")}>{row.status}</span>
                {row.details && <span className="truncate text-gray-400">{row.details}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={clsx("mt-8 grid gap-4", handleClose ? "grid-cols-2" : "grid-cols-1")}>
        {handleClose && (
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-lg border border-primary bg-primary-100 py-3 text-primary typo-sb-9"
          >
            닫기
          </button>
        )}
        <button type="button" onClick={onClick} className="w-full rounded-lg bg-primary py-3 text-white typo-sb-9">
          {buttonText}
        </button>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="desktop-page-shell">
        <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-5xl items-center gap-8 xl:grid-cols-[minmax(420px,520px)_minmax(280px,340px)]">
          <section className="flex justify-center">{content}</section>
          <aside className="rounded-lg border border-k-100 bg-white p-6">
            <p className="text-primary typo-sb-9">Score submitted</p>
            <h2 className="mt-2 text-k-900 typo-bold-4">승인 안내</h2>
            <p className="mt-3 text-k-500 typo-medium-3">
              제출한 성적은 운영팀 확인 후 사용할 수 있어요. 심사 중에는 지원에 사용할 수 없습니다.
            </p>
            <div className="mt-5 rounded-lg bg-k-50 px-4 py-3 text-k-600 typo-medium-3">
              승인 결과는 성적 확인하기 화면에서 다시 확인할 수 있습니다.
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 font-sans">{content}</div>;
};

export const DesktopSubmitResult = (props: SubmitResultProps) => <SubmitResultBase {...props} isDesktop />;

export const MobileSubmitResult = (props: SubmitResultProps) => <SubmitResultBase {...props} isDesktop={false} />;

// --- 컴포넌트 사용 예시 ---
const _ExamplePage = () => {
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
    <MobileSubmitResult
      title={"어학 성적 입력 완료"}
      description={"지원은 총 3번만 가능하며, 제출 완료 후 성적을 변경 하실 수 없습니다."}
      infoRows={infoRows}
      buttonText={"학점 입력하기"}
    />
  );
};

export default MobileSubmitResult;
