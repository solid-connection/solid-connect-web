import { useState } from "react";

import ExpendMoreFilled from "@/components/ui/icon/ExpendMoreFilled";
import StarFilledIcon from "@/components/ui/icon/star-filled";

import styles from "./college-reviews.module.css";

import { Review } from "@/types/review";

const CollegeReviews = ({ style, reviewList }: { style?: React.CSSProperties; reviewList: Review[] }) => (
  <div className={styles.container} style={style}>
    {reviewList.map((review) => (
      <CollegeReviewCard key={review.id} review={review} />
    ))}
  </div>
);

export default CollegeReviews;

export const CollegeReviewCard = ({ review }: { review: Review }) => {
  const { term, rating, content, dispatchSemester, transportation, buddyProgram } = review;
  const [open, setOpen] = useState<boolean>(false);
  const renderStars = () => {
    const TOTAL_STARS = 5;
    const stars = [];
    for (let i = 1; i <= TOTAL_STARS; i += 1) {
      if (i <= rating) {
        // Full Star
        stars.push(<StarFilledIcon key={i} leftColor="#6F90D1" rightColor="#6F90D1" />);
      } else if (i - 0.5 === rating) {
        // Half Star
        stars.push(<StarFilledIcon key={i} leftColor="#6F90D1" rightOpacity="0.54" />);
      } else {
        // Empty Star
        stars.push(<StarFilledIcon key={i} leftOpacity="0.54" rightOpacity="0.54" />);
      }
    }
    return stars;
  };

  if (open) {
    return (
      <div className={styles.card}>
        <div className={styles.firstRow}>
          <div className={styles.term}>{term}</div>
          <div className={styles.rating}>{renderStars()}</div>
        </div>
        <div className={styles.content} style={{ marginTop: "12px" }}>
          {content}
        </div>
        <div className={styles.infos} style={{ marginTop: "24px" }}>
          <div>
            <span>수학기간</span>
            <span>{dispatchSemester}</span>
          </div>
          <div>
            <span>교통편</span>
            <span>{transportation}</span>
          </div>
          <div>
            <span>버디프로그램</span>
            <span>{buddyProgram}</span>
          </div>
        </div>
        <button className={styles.toggleButton} onClick={() => setOpen(false)} type="button" aria-label="평가 펼치기">
          <ExpendMoreFilled style={{ transform: "rotate(180deg)" }} />
        </button>
      </div>
    );
  }
  return (
    <div className={styles.card}>
      <div className={styles.firstRow}>
        <div className={styles.term}>{term}</div>
        <div className={styles.rating}>{renderStars()}</div>
      </div>
      <button className={styles.toggleButton} onClick={() => setOpen(true)} type="button" aria-label="평가 펼치기">
        <ExpendMoreFilled />
      </button>
    </div>
  );
};
