import type { FormEvent, RefObject } from "react";
import { IconSearchFilled } from "@/public/svgs";

type ScoreSearchBarProps = {
  onClick: () => void;
  textRef: RefObject<HTMLInputElement>;
  searchHandler: (_e: FormEvent) => void;
};

const ScoreSearchBar = ({ onClick, textRef, searchHandler }: ScoreSearchBarProps) => (
  <form
    onClick={onClick}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
    className="flex h-12 flex-row items-center rounded-lg bg-white pl-3 shadow-sdwB"
    onSubmit={searchHandler}
    role="search"
  >
    <input
      className="w-full border-0 pl-2 text-k-500 outline-0 placeholder:text-k-300 typo-regular-2"
      placeholder="해외 파견 학교를 검색하세요."
      ref={textRef}
    />
    <button className="cursor-pointer border-0 bg-transparent pr-3" type="submit" aria-label="검색">
      <IconSearchFilled />
    </button>
  </form>
);

export default ScoreSearchBar;
