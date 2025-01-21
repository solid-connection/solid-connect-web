import clsx from "clsx";

import { ScoreSubmitStatus } from "@/types/score";

type ScoreCardProps = {
  name: string;
  score: string;
  status: ScoreSubmitStatus;
  date: string; // Date ISO string
  isFocused?: boolean;
};

const formatDate = (date: string) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  return `${year}.${month}.${day}`;
};

const getStatus = (status: ScoreSubmitStatus) => {
  switch (status) {
    case "PENDING":
      return (
        <div className="flex h-5 cursor-pointer items-center gap-0.5 rounded-[20px] bg-sub-b-100 p-2.5">
          <span className="font-serif text-[10px] font-bold leading-normal text-sub-b">심사 중</span>
          <div className="flex h-3 w-[11px] items-center justify-center rounded-[10px] bg-white font-serif text-[9px] font-medium leading-normal text-sub-b-500">
            ?
          </div>
        </div>
      );
    case "REJECTED":
      return (
        <div className="flex h-5 cursor-pointer items-center gap-0.5 rounded-[20px] bg-[#FFD9D9] p-2.5">
          <span className="font-serif text-[10px] font-bold leading-normal text-[#E22A2D]">승인 거절</span>
          <div className="flex h-3 w-[11px] items-center justify-center rounded-[10px] bg-white font-serif text-[9px] font-medium leading-normal text-[#E22A2D]">
            ?
          </div>
        </div>
      );
    case "APPROVED":
      return (
        <div className="flex h-5 items-center rounded-[20px] bg-primary-200 p-2.5">
          <span className="font-serif text-[10px] font-bold leading-normal text-secondary">승인 완료</span>
        </div>
      );
  }
};

const ScoreCard = ({ name, score, status, date, isFocused = false }: ScoreCardProps) => {
  return (
    <div className="flex h-[66px] flex-col rounded-lg bg-k-50 px-5 py-3">
      <div className="flex">
        <div>{getStatus(status)}</div>
        <div
          className={clsx("ml-3 font-serif text-sm font-semibold leading-normal", {
            "text-k-900": isFocused,
            "text-k-300": !isFocused,
          })}
        >
          {name}
        </div>
        <div
          className={clsx("ml-auto font-serif text-sm font-bold leading-normal", {
            "text-primary": isFocused,
            "text-primary-300": !isFocused,
          })}
        >
          {score}
        </div>
      </div>
      <div className="flex justify-end">
        <span className="font-serif text-[11px] font-normal leading-normal text-k-300">
          {status === "APPROVED" ? "만료일 : " : "제출일 : "}
          {formatDate(date)}
        </span>
      </div>
    </div>
  );
};

export default ScoreCard;
