import Link from "next/link";

import styles from "./my-status.module.css";

export default function MyStatus(props) {
  const { scrapCount, mentoCount, wishCollegeCount } = props;

  return (
    <div className={styles.container}>
      <Link href="/my/scrap/">
        <div className={styles.subject}>스크랩</div>
        <div className={styles.content}>{scrapCount || 0}개</div>
      </Link>

      <Link href="/my/favorite/">
        <div className={styles.subject}>관심 멘토</div>
        <div className={styles.content}>{mentoCount || 0}명</div>
      </Link>

      <Link href="/my/favorite/">
        <div className={styles.subject}>위시학교</div>
        <div className={styles.content}>{wishCollegeCount || 0}개</div>
      </Link>
    </div>
  );
}
