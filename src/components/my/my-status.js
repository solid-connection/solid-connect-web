import Link from "next/link";

import EditFilled from "../ui/icon/EditFilled";
import styles from "./my-status.module.css";

export default function MyStatus(props) {
  const { image, name, role, date, college, email } = props;
  return (
    <div className={styles.myStatus}>
      <div className={styles.myStatusTop}>
        <div className={styles.profileImage}>
          <img className={styles.image} src="/images/catolic.png" alt="프로필 이미지" />
        </div>
        <div className={styles.myInfo}>
          <div className={styles.myName}>김솔커</div>
          <div className={styles.myRoleAndDate}>
            <div className={styles.myRole}>Mento</div>
            <div className={styles.myDate}>2000.09.09</div>
          </div>
          <div className={styles.myCollege}>inha university</div>
          <div className={styles.myEmail}>1234@inha.edu</div>
        </div>
      </div>
      <div className={styles.myStatusBottom}>
        <div className={styles.favoriteBox}>
          <div className={styles.favoriteTitle}>
            관심 지역
            <span className={styles.favoriteIcon}>
              <EditFilled />
            </span>
          </div>
          <div className={styles.favoriteContent}>미선택</div>
        </div>
        <div className={styles.favoriteBox}>
          <div className={styles.favoriteTitle}>
            위시학교
            <span className={styles.favoriteIcon}>
              <EditFilled />
            </span>
          </div>
          <div className={styles.favoriteContent}>5개</div>
        </div>
      </div>
      <div className={styles.category}>
        <Link href="/" className={styles.item}>
          <div className={styles.itemText}>개인정보</div>
        </Link>
        <Link href="/" className={styles.item}>
          <div className={styles.itemText}>활동내역</div>
        </Link>
        <Link href="/" className={styles.item}>
          <div className={styles.itemText}>즐거찾기</div>
        </Link>
        <Link href="/" className={styles.item}>
          <div className={styles.itemText}>탭2</div>
        </Link>
        <Link href="/" className={styles.item}>
          <div className={styles.itemText}>로그아웃</div>
        </Link>
        <Link href="/" className={styles.item}>
          <div className={styles.itemText}>탈퇴하기</div>
        </Link>
      </div>
    </div>
  );
}
