import styles from "./score-search-field.module.css";

type ScoreSearchFieldProps = {
  keyWords: string[];
  setKeyWord: (keyWord: string) => void;
};

const ScoreSearchField = ({ keyWords, setKeyWord }: ScoreSearchFieldProps) => {
  return (
    <div>
      <div className={styles.title}>인기 검색</div>
      <div className={styles.container}>
        {keyWords.map((keyWord) => (
          <button key={keyWord} className={styles.item} onClick={() => setKeyWord(keyWord)} type="button">
            {keyWord}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScoreSearchField;
