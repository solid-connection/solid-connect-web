import styles from "./score-search-field.module.css";

export default function ScoreSearchField(props) {
  const { keyWords, setKeyWord } = props;

  return (
    <div>
      <div className={styles.title}>인기 검색</div>
      <div className={styles.container}>
        {keyWords.map((keyWord) => (
          <div key={keyWord} className={styles.item} onClick={() => setKeyWord(keyWord)} role="button">
            {keyWord}
          </div>
        ))}
      </div>
    </div>
  );
}
