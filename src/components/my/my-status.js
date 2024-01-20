import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

import MyProfile from "./my-profile";
import EditFilled from "../ui/icon/EditFilled";
import styles from "./my-status.module.css";
import Modal from "../ui/modal";

export default function MyStatus(props) {
  const { image, name, role, date, college, email } = props;

  const handleLogout = () => {
    signOut();
  };

  const [showLogout, setShowLogout] = useState(false);
  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const [showWithdraw, setShowWithdraw] = useState(false);
  const toggleWithdraw = () => {
    setShowWithdraw(!showWithdraw);
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

      <div className={styles.favoriteContainer}>
        <Link href="/my/scrap/" className={styles.favoriteBox}>
          <div className={styles.favoriteTitle}>
            스크랩
            <span className={styles.favoriteIcon}>
              <EditFilled />
            </span>
          </div>
          <div className={styles.favoriteContent}>2개</div>
        </Link>

        <div className={styles.favoriteBox}>
          <div className={styles.favoriteTitle}>
            관심 멘토
            <span className={styles.favoriteIcon}>
              <EditFilled />
            </span>
          </div>
          <div className={styles.favoriteContent}>3명</div>
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
        <Link href="/my/activity/" className={styles.item}>
          <div className={styles.itemText}>활동내역</div>
        </Link>
        <Link href="/my/favorite/" className={styles.item}>
          <div className={styles.itemText}>즐거찾기</div>
        </Link>
        <button className={styles.item} onClick={toggleLogout}>
          <div className={styles.itemText}>로그아웃</div>
        </button>
        <Modal show={showLogout} handleCancel={toggleLogout} title="로그아웃" content="로그아웃 하시겠습니까?" />
        <button className={styles.item} onClick={toggleWithdraw}>
          <div className={styles.itemText}>탈퇴하기</div>
        </button>
        <Modal show={showWithdraw} handleCancel={toggleWithdraw} title="탈퇴하기" content={"30일 이내 복귀시 탈퇴 자동 취소되며\n탈퇴 완료시 기존 정보 모두 소멸 됩니다.\n탈퇴 하시겠습니까?"} />
      </div>
    </div>
  );
}
