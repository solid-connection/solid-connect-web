import clsx from "clsx";

import { ScoreSubmitStatus } from "@/types/score";

import { toast } from "@/lib/zustand/useToastStore";

type ScoreCardProps = {
  name: string;
  score: string;
  status: ScoreSubmitStatus;
  date: string; // Date ISO string
  isFocused?: boolean;
  rejectedReason?: string | null;
};

const formatDate = (date: string) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  return `${year}.${month}.${day}`;
};

const getStatus = (status: ScoreSubmitStatus, rejectedReason?: string | null) => {
  switch (status) {
    case "PENDING":
      return (
        <div className="flex h-5 cursor-pointer items-center gap-0.5 rounded-[20px] bg-sub-b-100 p-2.5">
          <span className="font-serif text-sub-b typo-bold-7">심사 중</span>
          <div className="flex h-3 w-[11px] items-center justify-center rounded-[10px] bg-white font-serif text-sub-b-500 typo-medium-5">
            ?
          </div>
        </div>
      );
    case "REJECTED":
      return (
        <div
          className="flex h-5 cursor-pointer items-center gap-0.5 rounded-[20px] bg-accent-custom-red-light p-2.5"
          onClick={() => toast.error(rejectedReason ?? "승인이 거절되었습니다.")}
        >
          <span className="font-serif text-accent-custom-red typo-bold-7">승인 거절</span>
          <div className="flex h-3 w-[11px] items-center justify-center rounded-[10px] bg-white font-serif text-accent-custom-red typo-medium-5">
            ?
          </div>
        </div>
      );
    case "APPROVED":
      return (
        <div className="flex h-5 items-center rounded-[20px] bg-secondary-200 p-2.5">
          <span className="font-serif text-primary typo-bold-7">승인 완료</span>
        </div>
      );
  }
};

const ScoreCard = ({ name, score, status, date, isFocused = false, rejectedReason = null }: ScoreCardProps) => {
  const isVerified = status === "APPROVED";

  return (
    <div
      className={clsx(
        "flex h-[66px] flex-col rounded-lg px-5 py-3",
        isVerified ? "bg-secondary-100" : "bg-k-50",
        isFocused && "border border-secondary",
      )}
    >
      <div className="flex">
        <div>{getStatus(status, rejectedReason)}</div>
        <div
          className={clsx("ml-3 flex flex-col text-start font-serif typo-sb-9", {
            "text-k-900": isVerified,
            "text-k-300": !isVerified,
          })}
        >
          {name}
          <span className="font-serif text-k-300 typo-regular-5">
            {status === "APPROVED" ? "만료일 : " : "제출일 : "}
            {formatDate(date)}
          </span>
        </div>
        <div
          className={clsx("ml-auto flex items-center font-serif typo-bold-5", {
            "text-secondary": isFocused,
            "text-secondary-300": !isFocused,
          })}
        >
          {score}
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
