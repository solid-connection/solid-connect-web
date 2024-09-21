import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { signOutApi } from "@/services/auth";

import Modal from "@/components/ui/text-modal";

export default function MyMenu() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOutApi()
      .then((res) => {})
      .catch((err) => {
        if (err.response) {
          console.error("Axios response error", err.response);
          if (err.response.status === 401 || err.response.status === 403) {
            document.location.href = "/login";
          } else {
            alert(err.response.data?.message);
          }
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
    <div className="flex flex-col">
      <MenuLinkItem href="/my/favorite/" text="위시학교" />
      <MenuLinkItem href="/score/register/" text="공인어학/학점 변경하기" />
      <MenuLinkItem href="/score/college-register/" text="지원학교 변경하기" />
      <MenuButtonItem onClick={toggleLogout} text="로그아웃" />
      <Modal
        show={showLogout}
        handleCancel={toggleLogout}
        handleConfirm={handleLogout}
        title="로그아웃"
        content="로그아웃 하시겠습니까?"
      />
      <MenuButtonItem onClick={toggleWithdraw} text="탈퇴하기" />
      <Modal
        show={showWithdraw}
        handleCancel={toggleWithdraw}
        title="탈퇴하기"
        content={"30일 이내 복귀시 탈퇴 자동 취소되며\n탈퇴 완료시 기존 정보 모두 소멸 됩니다.\n탈퇴 하시겠습니까?"}
      />
    </div>
  );
}

const MenuLinkItem = ({ href, text }) => {
  return (
    <Link href={href} className="flex h-[61px] cursor-pointer items-center border-0 bg-white pl-5 no-underline">
      <div className="text-black font-serif text-[16px] font-normal leading-normal">{text}</div>
    </Link>
  );
};

const MenuButtonItem = ({ onClick, text }) => {
  return (
    <button onClick={onClick} className="flex h-[61px] cursor-pointer items-center border-0 bg-white pl-5 no-underline">
      <div className="text-black font-serif text-[16px] font-normal leading-normal">{text}</div>
    </button>
  );
};
