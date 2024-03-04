import styles from "./college-review-form.module.css";

export default function CollegeReviewForm() {
  return (
    <form className={styles.form}>
      <div>stars</div>
      <textarea className={styles.content}></textarea>
      <div className={styles.elements}>
        <div>
          <span>파견학기를 선택해주세요.</span>
        </div>
        <div>
          <span>수학기간을 선택해주세요.</span>
          <div className={styles.btns}>
            <input type="radio" id="dispatchTerm1" name="dispatchTerm" value="1학기" hidden />
            <label htmlFor="dispatchTerm1" className={styles["btn"]}>
              1학기
            </label>
            <input type="radio" id="dispatchTerm2" name="dispatchTerm" value="2학기" hidden />
            <label htmlFor="dispatchTerm2" className={styles["btn"]}>
              2학기
            </label>
            <input type="radio" id="dispatchTerm3" name="dispatchTerm" value="기타" hidden />
            <label htmlFor="dispatchTerm3" className={styles["btn"]}>
              기타
            </label>
          </div>
        </div>
        <div>
          <span>타 지역을 이동하는 교통편이 편리한가요?</span>
          <div className={styles.btns}>
            <input type="radio" id="transportation1" name="transportation" value="상" hidden />
            <label htmlFor="transportation1" className={`${styles["btn"]} ${styles["btn-sm"]}`}>
              상
            </label>
            <input type="radio" id="transportation2" name="transportation" value="중" hidden />
            <label htmlFor="transportation2" className={`${styles["btn"]} ${styles["btn-sm"]}`}>
              중
            </label>
            <input type="radio" id="transportation3" name="transportation" value="하" hidden />
            <label htmlFor="transportation3" className={`${styles["btn"]} ${styles["btn-sm"]}`}>
              하
            </label>
          </div>
        </div>
        <div>
          <span>파견학교의 버디프로그램이 활발하게 진행되나요?</span>
          <div className={styles.btns}>
            <input type="radio" id="buddy1" name="buddy" value="상" hidden />
            <label htmlFor="buddy1" className={`${styles["btn"]} ${styles["btn-sm"]}`}>
              상
            </label>
            <input type="radio" id="buddy2" name="buddy" value="중" hidden />
            <label htmlFor="buddy2" className={`${styles["btn"]} ${styles["btn-sm"]}`}>
              중
            </label>
            <input type="radio" id="buddy3" name="buddy" value="하" hidden />
            <label htmlFor="buddy3" className={`${styles["btn"]} ${styles["btn-sm"]}`}>
              하
            </label>
            <input type="radio" id="buddy4" name="buddy" value="없음" hidden />
            <label htmlFor="buddy4" className={`${styles["btn"]} ${styles["btn-sm"]}`}>
              없음
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
