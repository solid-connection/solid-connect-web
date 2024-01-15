import styles from "./college-search-bar.module.css";
import SearchFilled from "@/components/ui/icon/SearchFilled";

export default function CollegeSearchBar(props) {
  const { onClick, text, setText, searchHandler } = props;

  return (
    <>
      <form onClick={onClick} className={styles.searchBar} onSubmit={searchHandler}>
        <input className={styles.searchInput} placeholder="해외 파견 학교를 검색하세요." value={text} onChange={(e) => setText(e.target.value)} />
        <button className={styles.searchButton} type="submit">
          <SearchFilled />
        </button>
      </form>
    </>
  );
}
