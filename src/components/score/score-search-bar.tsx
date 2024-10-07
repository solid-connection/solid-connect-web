import SearchFilled from "@/components/ui/icon/SearchFilled";

import styles from "./score-search-bar.module.css";

type ScoreSearchBarProps = {
  onClick: () => void;
  textRef: React.RefObject<HTMLInputElement>;
  searchHandler: (e: React.FormEvent) => void;
};

export default function ScoreSearchBar({ onClick, textRef, searchHandler }: ScoreSearchBarProps) {
  return (
    // eslint-disable-next-line
    <form onClick={onClick} className={styles.searchBar} onSubmit={searchHandler}>
      <input className={styles.searchInput} placeholder="해외 파견 학교를 검색하세요." ref={textRef} />
      <button className={styles.searchButton} type="submit" aria-label="검색">
        <SearchFilled />
      </button>
    </form>
  );
}
