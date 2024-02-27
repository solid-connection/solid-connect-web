import React, { useRef, useEffect } from "react";

import { Review } from "@/types/review";

import styles from "./college-reviews.module.css";

export default function CollegeReviews({ style, reviewList }: { style?: React.CSSProperties; reviewList: Review[] }) {
  return (
    <div className={styles.container} style={style}>
      {reviewList.map((review) => (
        <CollegeReviewCard key={review.id} {...review} />
      ))}
    </div>
  );
}

export function CollegeReviewCard({ term, rating, content, dispatchSemester, transportation, buddyProgram }: Review) {
  const [open, setOpen] = React.useState(false);
  const renderStars = () => {
    const totalStars = 5;
    let stars = [];
    for (let i = 1; i <= totalStars; i++) {
      if (i <= rating) {
        // Full Star
        stars.push(
          <span key={i} className={styles.fullStar}>
            ★
          </span>
        );
      } else if (i - 0.5 === rating) {
        // Half Star
        stars.push(
          <span key={i} className={styles.halfStar}>
            ★
          </span>
        );
      } else {
        // Empty Star
        stars.push(
          <span key={i} className={styles.emptyStar}>
            ☆
          </span>
        );
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
      </div>
    );
  } else {
    return (
      <div className={styles.card}>
        <div className={styles.firstRow}>
          <div className={styles.term}>{term}</div>
          <div className={styles.rating}>{renderStars()}</div>
        </div>
      </div>
    );
  }
}
