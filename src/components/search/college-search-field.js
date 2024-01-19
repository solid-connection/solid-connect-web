import styles from "./college-search-field.module.css";

export default function CollegeSearchField(props) {
  const { setText, keyWords, searchHandler } = props;

  const handleKeywordClick = (keyWord) => {
    setText(keyWord);
    searchHandler();
  };

  return (
    <div>
      <div className={styles.title}>인기 검색</div>
      <div className={styles.container}>
        {keyWords.map((keyWord) => (
          <div key={keyWord} className={styles.item} onClick={() => handleKeywordClick(keyWord)} role="button">
            {keyWord}
          </div>
        ))}
      </div>
    </div>
  );
}
