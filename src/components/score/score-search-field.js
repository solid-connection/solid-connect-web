import styles from "./score-search-field.module.css";

export default function ScoreSearchField(props) {
  const { setText, keyWords } = props;

  const handleKeywordClick = (keyWord) => {
    setText(keyWord); // Update the text state with the clicked keyword
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
