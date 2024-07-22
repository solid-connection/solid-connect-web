import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { signOutApi } from "@/services/auth";

import Modal from "../ui/modal";
import styles from "./my-menu.module.css";

export default function MyMenu() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOutApi()
      .then((res) => {})
      .catch((err) => {
        if (err.response) {
          console.error("Axios response error", err.response.data);
          alert(err.response.data?.error?.message);
        } else if (err.reqeust) {
          console.error("Axios request error", err.request);
        } else {
          console.error("Error", err.message);
          alert(err.message);
        }
      })
      .finally(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.push("/"); // API 호출과 토큰 제거 작업이 모두 완료된 후에 페이지 이동
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
      <Link href="/my/favorite/" className={styles.item}>
        <div>위시학교</div>
      </Link>
      <Link href="/score/register/" className={styles.item}>
        <div>공인어학/학점 변경하기</div>
      </Link>
      <Link href="/score/college-register/" className={styles.item}>
        <div>지원학교 변경하기</div>
      </Link>
      <button onClick={toggleLogout} className={styles.item}>
        <div>로그아웃</div>
      </button>
      <Modal
        show={showLogout}
        handleCancel={toggleLogout}
        handleConfirm={handleLogout}
        title="로그아웃"
        content="로그아웃 하시겠습니까?"
      />
      <button className={styles.item} onClick={toggleWithdraw}>
        <div>탈퇴하기</div>
      </button>
      <Modal
        show={showWithdraw}
        handleCancel={toggleWithdraw}
        title="탈퇴하기"
        content={"30일 이내 복귀시 탈퇴 자동 취소되며\n탈퇴 완료시 기존 정보 모두 소멸 됩니다.\n탈퇴 하시겠습니까?"}
      />
    </div>
  );
}
