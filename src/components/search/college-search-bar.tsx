import styles from "./college-search-bar.module.css";

import { IconSearchFilled } from "@/public/svgs";

type CollegeSearchBarProps = {
  onClick: () => void;
  text: string;
  setText: (text: string) => void;
  searchHandler: (e: React.FormEvent<HTMLFormElement>) => void;
};

const CollegeSearchBar = ({ onClick, text, setText, searchHandler }: CollegeSearchBarProps) => (
  // eslint-disable-next-line
  <form onClick={onClick} className={styles.searchBar} onSubmit={searchHandler}>
    <input
      className={styles.searchInput}
      placeholder="해외 파견 학교를 검색하세요."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
    <button className={styles.searchButton} type="submit" aria-label="검색">
      <IconSearchFilled />
    </button>
  </form>
);

export default CollegeSearchBar;
