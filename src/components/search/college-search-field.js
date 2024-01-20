import styles from "./college-search-field.module.css";

export default function CollegeSearchField(props) {
  const { setText, keyWords, searchHandler } = props;

  return (
    <div>
      <div className={styles.title}>인기 검색</div>
      <div className={styles.container}>
        {keyWords.map((keyWord) => (
          <div key={keyWord} className={styles.item} onClick={() => setText(keyWord)} role="button">
            {keyWord}
          </div>
        ))}
      </div>
    </div>
  );
}
