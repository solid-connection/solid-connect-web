import React from "react";

import { IconClock } from "../../../public/svgs";
import styles from "./mento.module.css";

export default function MentorPage() {
  return <MentorComingSoon />;
}

const MentorComingSoon = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <IconClock className={styles.icon} />
        <h2 className={styles.title}>멘토 기능 준비 중</h2>
        <p className={styles.description}>
          여러분을 위한 멘토링 서비스를 준비하고 있습니다.
          <br />
          조금만 기다려 주세요!
        </p>
        <div className={styles.divider}></div>
      </div>
    </div>
  );
};
