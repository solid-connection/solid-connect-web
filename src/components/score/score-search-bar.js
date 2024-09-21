import SearchFilled from "@/components/ui/icon/SearchFilled";

import styles from "./score-search-bar.module.css";

export default function ScoreSearchBar(props) {
  const { onClick, textRef, searchHandler } = props;

  return (
    <form onClick={onClick} className={styles.searchBar} onSubmit={searchHandler}>
      <input className={styles.searchInput} placeholder="해외 파견 학교를 검색하세요." ref={textRef} />
      <button className={styles.searchButton} type="submit">
        <SearchFilled />
      </button>
    </form>
  );
}
