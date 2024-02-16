import styles from "./college-filter-old.module.css";

function CollegeFilter() {
  return (
    <div className={styles.wrapper}>
      <select className={styles.select}>
        <option value="all">필터</option>
        <option value="">필터2</option>
        <option value="">필터3</option>
        <option value="">필터4</option>
      </select>
    </div>
  );
}

export default CollegeFilter;
