import Link from "next/link";
import { signOut } from "next-auth/react";

import MyProfile from "./my-profile";
import EditFilled from "../ui/icon/EditFilled";
import styles from "./my-status.module.css";

export default function MyStatus(props) {
  const { image, name, role, date, college, email } = props;

  const handleLogout = () => {
    signOut();
  };

  const data = {
    name: "김솔커",
    image: "/images/catolic.png",
    role: "Mento",
    date: "2000.09.09",
    college: "inha university",
    email: "1234@inha.edu",
  };

  return (
    <div className={styles.myStatus}>
      <MyProfile {...data} />

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
        <button href="/" className={styles.item} onClick={handleLogout}>
          <div className={styles.itemText}>로그아웃</div>
        </button>
        <Link href="/" className={styles.item}>
          <div className={styles.itemText}>탈퇴하기</div>
        </Link>
      </div>
    </div>
  );
}
