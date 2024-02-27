import styles from "./college-search.module.css";
import SearchFilled from "@/components/ui/icon/SearchFilled";

export default function CollegeSearch(props) {
  const { onClick, searchHandler, textRef, defaultValue } = props;

  return (
    <form onClick={onClick} className={styles.searchBar} onSubmit={searchHandler}>
      <input className={styles.searchInput} ref={textRef} defaultValue={defaultValue} placeholder="해외 파견 학교를 검색하세요." />
      <button className={styles.searchButton} type="submit">
        <SearchFilled />
      </button>
    </form>
  );
}
