import Link from "next/link";
// import { signOut } from "next-auth/react";

import styles from "./my-status.module.css";

export default function MyStatus(props) {
  const { scrapCount, mentoCount, wishCollegeCount } = props;

  return (
    <div className={styles.container}>
      <Link href="/my/scrap/">
        <div className={styles.subject}>스크랩</div>
        <div className={styles.content}>2개</div>
      </Link>

      <Link href="/my/favorite/">
        <div className={styles.subject}>관심 멘토</div>
        <div className={styles.content}>3명</div>
      </Link>

      <Link href="/my/favorite/">
        <div className={styles.subject}>위시학교</div>
        <div className={styles.content}>5개</div>
      </Link>
    </div>
  );
}
