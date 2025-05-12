import { useEffect, useState } from "react";

import styles from "./college-search.module.css";

import { IconSearchFilled } from "@/public/svgs";

type UniversitySearchProps = {
  searchHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  textRef: React.RefObject<HTMLInputElement>;
  defaultValue: string;
};

const UniversitySearch = ({ searchHandler, textRef, defaultValue }: UniversitySearchProps) => {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    if (inputValue === "") {
      // 빈 입력값이 감지되면 searchHandler를 호출합니다.
      const fakeEvent = {
        preventDefault: () => {},
        currentTarget: textRef.current?.form,
        target: textRef.current?.form,
      } as unknown as React.FormEvent<HTMLFormElement>;

      searchHandler(fakeEvent);
    }
  }, [inputValue]);

  return (
    <form className={styles.searchBar} onSubmit={searchHandler}>
      <input
        className={styles.searchInput}
        ref={textRef}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          searchHandler(e);
        }}
        placeholder="해외 파견 학교를 검색하세요."
      />
      <button className={styles.searchButton} type="submit" aria-label="대학 검색하기">
        <IconSearchFilled />
      </button>
    </form>
  );
};

export default UniversitySearch;
