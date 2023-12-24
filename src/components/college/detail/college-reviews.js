import CollegeReviewCard from "./college-review-card";

import styles from "./college-reviews.module.css";

export default function CollegeReviews() {
  return (
    <div className={styles.container}>
      <div className={styles.items}>
        <CollegeReviewCard />
        <CollegeReviewCard />
        <CollegeReviewCard />
        <CollegeReviewCard />
        <CollegeReviewCard />
        <CollegeReviewCard />
        <CollegeReviewCard />
        <CollegeReviewCard />
      </div>
    </div>
  );
}
