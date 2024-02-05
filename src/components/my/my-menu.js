import { useState } from "react";
import Link from "next/link";

import styles from "./my-menu.module.css";
import Modal from "../ui/modal";

export default function MyMenu() {
  const handleLogout = () => {
    fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error("로그아웃 실패", error);
      });
  };

  const [showLogout, setShowLogout] = useState(false);
  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const [showWithdraw, setShowWithdraw] = useState(false);
  const toggleWithdraw = () => {
    setShowWithdraw(!showWithdraw);
  };

  return (
    <div className={styles.menu}>
      <Link href="/my/activity/" className={styles.item}>
        <div>활동내역</div>
      </Link>
      <Link href="/my/favorite/" className={styles.item}>
        <div>즐거찾기</div>
      </Link>
      <button onClick={toggleLogout} className={styles.item}>
        <div>로그아웃</div>
      </button>
      <Modal show={showLogout} handleCancel={toggleLogout} handleConfirm={handleLogout} title="로그아웃" content="로그아웃 하시겠습니까?" />
      <button className={styles.item} onClick={toggleWithdraw}>
        <div>탈퇴하기</div>
      </button>
      <Modal show={showWithdraw} handleCancel={toggleWithdraw} title="탈퇴하기" content={"30일 이내 복귀시 탈퇴 자동 취소되며\n탈퇴 완료시 기존 정보 모두 소멸 됩니다.\n탈퇴 하시겠습니까?"} />
    </div>
  );
}
