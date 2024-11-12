import SearchFilled from "@/components/ui/icon/SearchFilled";

import styles from "./score-search-bar.module.css";

type ScoreSearchBarProps = {
  onClick: () => void;
  textRef: React.RefObject<HTMLInputElement>;
  searchHandler: (e: React.FormEvent) => void;
};

const ScoreSearchBar = ({ onClick, textRef, searchHandler }: ScoreSearchBarProps) => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
  <form onClick={onClick} className={styles.searchBar} onSubmit={searchHandler}>
    <input className={styles.searchInput} placeholder="해외 파견 학교를 검색하세요." ref={textRef} />
    <button className={styles.searchButton} type="submit" aria-label="검색">
      <SearchFilled />
    </button>
  </form>
);

export default ScoreSearchBar;
