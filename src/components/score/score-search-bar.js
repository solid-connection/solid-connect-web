import SearchFilled from "../ui/icon/SearchFilled";
import styles from "./score-search-bar.module.css";

export default function ScoreSearchBar(props) {
  const { onClick, text, setText, handleSearch } = props;

  return (
    <>
      <form onClick={onClick} className={styles.searchBar} onSubmit={handleSearch}>
        <input className={styles.searchInput} placeholder="해외 파견 학교를 검색하세요." value={text} onChange={(e) => setText(e.target.value)} />
        <button className={styles.searchButton} type="submit">
          <SearchFilled />
        </button>
      </form>
    </>
  );
}
