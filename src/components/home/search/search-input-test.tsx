import EditTwo from "@/components/layout/icon/EditTwo";

import styles from "./search-input-test.module.css";

export default function SearchInputTest(props) {
  const { test, score, setScore } = props;
  return (
    <div className={styles.box}>
      <div className={styles.box_left}>
        <div className={styles.icon}>
          <EditTwo />
        </div>
        <div className={styles.main}>{test}</div>
      </div>
      <div className={styles.box_right}>
        <input
          className={styles.input}
          placeholder="성적입력"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          maxLength={5}
        />
      </div>
    </div>
  );
}
