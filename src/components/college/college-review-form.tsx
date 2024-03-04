import { useEffect, useState } from "react";

import styles from "./college-review-form.module.css";
import BlockBtn from "../ui/block-btn";
import StarFilledIcon from "@/components/ui/icon/star-filled";

export default function CollegeReviewForm() {
  const totalStars = 5;
  const [rating, setRating] = useState<number>(2.5);

  const handleStarClick = (index, event) => {
    // 별의 어느 부분을 클릭했는지에 따라 점수를 계산합니다.
    const rect = event.target.getBoundingClientRect();
    const isLeftHalf = event.clientX - rect.left < rect.width / 2;
    setRating(isLeftHalf ? index - 0.5 : index);
  };

  return (
    <form className={styles.form}>
      <div className={styles.rating}>
        {[...Array(totalStars)].map((_, index) => {
          const filled = rating > index + 0.5 ? ["#6F90D1", "#6F90D1", "1", "1"] : rating > index ? ["#6F90D1", "#000000", "1", "0.54"] : ["#000000", "#000000", "0.54", "0.54"];
          return <StarFilledIcon key={index} index={index} size="30" leftColor={filled[0]} rightColor={filled[1]} leftOpacity={filled[2]} rightOpacity={filled[3]} onClick={(event) => handleStarClick(index + 1, event)} style={{ cursor: "pointer" }} />;
        })}
      </div>

      <textarea className={styles.content} placeholder="학교에 대한 생생한 후기를 들려주세요."></textarea>
      <div className={styles.elements}>
        <div>
          <span>파견학기를 선택해주세요.</span>
          <div className={styles.btns}>
            <select className={styles.btn} name="semester">
              <option value="21-1" selected disabled>
                파견학기
              </option>
              <option value="23-1">23-1</option>
              <option value="23-2">23-2</option>
              <option value="24-1">24-1</option>
              <option value="24-2">24-2</option>
            </select>
          </div>
        </div>
        <div>
          <span>수학기간을 선택해주세요.</span>
          <div className={styles.btns}>
            <input type="radio" id="dispatchPeriod1" name="dispatchPeriod" value="1학기" hidden />
            <label htmlFor="dispatchPeriod1" className={styles["btn"]}>
              1학기
            </label>
            <input type="radio" id="dispatchPeriod2" name="dispatchPeriod" value="2학기" hidden />
            <label htmlFor="dispatchPeriod2" className={styles["btn"]}>
              2학기
            </label>
            <input type="radio" id="dispatchPeriod3" name="dispatchPeriod" value="기타" hidden />
            <label htmlFor="dispatchPeriod3" className={styles["btn"]}>
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
      <BlockBtn style={{ marginTop: "24px" }}>작성하기</BlockBtn>
    </form>
  );
}
