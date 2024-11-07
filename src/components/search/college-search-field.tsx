import styles from "./college-search-field.module.css";

type CollegeSearchFieldProps = {
  setText: (text: string) => void;
  keyWords: string[];
};

const CollegeSearchField = ({ setText, keyWords }: CollegeSearchFieldProps) => (
  <div>
    <div className={styles.title}>인기 검색</div>
    <div className={styles.container}>
      {keyWords.map((keyWord) => (
        <button key={keyWord} className={styles.item} onClick={() => setText(keyWord)} type="button">
          {keyWord}
        </button>
      ))}
    </div>
  </div>
);

export default CollegeSearchField;
