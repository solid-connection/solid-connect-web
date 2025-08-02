import { useRouter } from "next/router";
import { useState } from "react";

import { IconTablerSearch } from "@/public/svgs";

const CollegeSearch = () => {
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter();

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/college?keyword=${searchText}`);
  };

  return (
    <div className="mr-5">
      <form className="flex items-center rounded-[8px] bg-[#f7f7f7] pr-[16px]" onSubmit={onSearch}>
        <input
          className="box-border w-full rounded-[8px] border-none bg-[#f7f7f7] p-[12px_16px] font-serif text-[14px] font-normal uppercase leading-[150%] tracking-[-0.35px] text-black outline-none placeholder:text-[#a8a8a8]"
          type="text"
          placeholder="원하는 해외 학교를 검색해보세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="cursor-pointer border-0 bg-transparent" type="submit" aria-label="대학 검색하기">
          <IconTablerSearch />
        </button>
      </form>
    </div>
  );
};

export default CollegeSearch;
