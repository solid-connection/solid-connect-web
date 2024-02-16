import styles from "./college-search.module.css";
import SearchFilled from "@/components/ui/icon/SearchFilled";

export default function CollegeSearch(props) {
  const { onClick, searchHandler, text, setText } = props;

  return (
    <form onClick={onClick} className={styles.searchBar} onSubmit={searchHandler}>
      <input className={styles.searchInput} placeholder="해외 파견 학교를 검색하세요." value={text} onChange={(e) => setText(e.target.value)} />
      <button className={styles.searchButton} type="submit">
        <SearchFilled />
      </button>
    </form>
  );
}
