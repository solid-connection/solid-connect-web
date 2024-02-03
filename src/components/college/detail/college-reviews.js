import React, { useRef, useEffect } from "react";
import styles from "./college-reviews.module.css";

export default function CollegeReviews(props) {
  const containerRef = useRef(null);

  const handleWheel = (e) => {
    if (containerRef.current) {
      e.preventDefault(); // 기본 스크롤 동작 중지
      containerRef.current.scrollLeft += e.deltaY;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container} style={props.style}>
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

export function CollegeReviewCard(props) {
  return <div className={styles.card}></div>;
}
