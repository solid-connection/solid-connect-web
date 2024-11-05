import { useEffect, useState } from "react";

import SearchFilled from "@/components/ui/icon/SearchFilled";

import styles from "./college-search.module.css";

type UniversitySearchProps = {
  searchHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  textRef: React.RefObject<HTMLInputElement>;
  defaultValue: string;
};

export default function UniversitySearch({ searchHandler, textRef, defaultValue }: UniversitySearchProps) {
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
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="해외 파견 학교를 검색하세요."
      />
      <button className={styles.searchButton} type="submit" aria-label="대학 검색하기">
        <SearchFilled />
      </button>
    </form>
  );
}
