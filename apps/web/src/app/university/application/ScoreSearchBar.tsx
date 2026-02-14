import type { RefObject } from "react";
import { IconSearchFilled } from "@/public/svgs";

type ScoreSearchBarProps = {
  onClick: () => void;
  textRef: RefObject<HTMLInputElement | null>;
  searchHandler: (_e: React.FormEvent) => void;
};

const ScoreSearchBar = ({ onClick, textRef, searchHandler }: ScoreSearchBarProps) => (
  <form
    onClick={onClick}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
    className="flex h-[53px] flex-row items-center border-b border-bg-700"
    onSubmit={searchHandler}
    role="search"
  >
    <input
      className="w-full border-0 pl-6 text-gray-400 outline-0 typo-regular-1"
      placeholder="해외 파견 학교를 검색하세요."
      ref={textRef}
    />
    <button className="cursor-pointer border-0 bg-white pr-[11px]" type="submit" aria-label="검색">
      <IconSearchFilled />
    </button>
  </form>
);

export default ScoreSearchBar;
