import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { deleteAccountApi, signOutApi } from "@/services/auth";
import { getMyInfoApi } from "@/services/myInfo";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import Modal from "@/components/ui/text-modal";
import MyInfoCard from "@/containers/my/MyInfoCard";
import MyMenu from "@/containers/my/MyMenu";
import MyMenuGroup from "@/containers/my/MyMenuGroup";

import { MyInfo } from "@/types/myInfo";

import { IconNoProfileImage } from "@/public/svgs";
import { IconMyMenuCalendar, IconMyMenuLock, IconMyMenuPerson } from "@/public/svgs/my";

const roleDisplay = {
  MENTO: "Mento",
  MENTEE: "Mentee",
};

const MyPage = () => {
  const router = useRouter();
  const [myInfo, setMyInfo] = useState<MyInfo>(null);
  const [showLogout, setShowLogout] = useState<boolean>(false);
  const [showWithdraw, setShowWithdraw] = useState<boolean>(false);

  useEffect(() => {
    const fetchMyData = async () => {
      await getMyInfoApi()
        .then((res) => {
          setMyInfo(res.data);
        })
        .catch((err) => {
          if (err.response) {
            console.error("Axios response error", err.response);
            if (err.response.status === 401 || err.response.status === 403) {
              alert("로그인이 필요합니다");
              document.location.href = "/login";
            } else {
              alert(err.response.data?.message);
            }
          } else {
            console.error("Error", err.message);
            alert(err.message);
          }
        });
    };
    fetchMyData();
  }, []);

  const handleLogout = async () => {
    await signOutApi()
      .then(() => {})
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

  const handleWithdraw = async () => {
    await deleteAccountApi()
      .then(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.confirm("탈퇴 신청이 완료되었습니다. 30일 후 계정이 삭제됩니다.");
        router.push("/");
      })
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
      });
  };

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const toggleWithdraw = () => {
    setShowWithdraw(!showWithdraw);
  };

  if (!myInfo) {
    return null;
  }

  return (
    <>
      <Head>
        <title>마이페이지</title>
      </Head>
      <TopDetailNavigation title="마이페이지" />
      <div>
        <div className="my-9 ml-5 flex h-12 gap-5">
          <div>
            {myInfo.profileImageUrl ? (
              <img
                className="h-[45px] w-[45px] rounded-full object-cover"
                src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${myInfo.profileImageUrl}`}
                alt="프로필"
              />
            ) : (
              <IconNoProfileImage />
            )}
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-end gap-2">
              <span className="font-serif text-xl font-bold text-black">{myInfo.nickname || "닉네임"}</span>
              <span className="font-serif text-xs font-medium text-[#717171]">
                {myInfo.role in roleDisplay ? roleDisplay[myInfo.role] : "역할"}
              </span>
            </div>

            <div className="flex gap-0.5">
              <span className="font-serif text-xs font-normal leading-4 text-[#717171]">inha university</span>
              <span className="font-serif text-xs font-normal leading-4 text-[#717171]">{myInfo.email}</span>
            </div>
          </div>
        </div>

        <div className="mx-4 mb-[29px]">
          <MyInfoCard scarpCount={0} interestMentoCount={0} wishUniversityCount={0} />
        </div>
        <div>
          <MyMenuGroup icon={<IconMyMenuPerson />} subject="내 정보">
            <Link href="/my/modify">
              <MyMenu text="프로필 관리" />
            </Link>
            <Link href="/score/register/">
              <MyMenu text="공인어학/학점 변경" />
            </Link>
            <Link href="/score/college-register/">
              <MyMenu text="지원학교 변경" isBold={true} />
            </Link>
          </MyMenuGroup>
          <MyMenuGroup icon={<IconMyMenuCalendar />} subject="내 활동">
            <Link href="">
              <MyMenu text="활동 내역" />
            </Link>
            <Link href="">
              <MyMenu text="멘토 지원" />
            </Link>
          </MyMenuGroup>
          <MyMenuGroup icon={<IconMyMenuLock />} subject="내 계정">
            <div className="flex h-10 items-center justify-between pl-7 pr-7">
              <span className="font-serif text-sm font-normal text-black">솔커 계정</span>
              <div className="flex items-center gap-2">
                <span className="font-serif text-[10px] font-semibold text-[#707070]">카카오 로그인</span>
                <span className="font-serif text-xs font-medium text-[#707070]">{myInfo.email}</span>
              </div>
            </div>
            <div onClick={toggleLogout}>
              <MyMenu text="로그아웃" isArrowVisible={false} />
            </div>
            <div onClick={toggleWithdraw}>
              <MyMenu text="회원탈퇴" isArrowVisible={false} isBold={true} />
            </div>
          </MyMenuGroup>
        </div>

        <Modal
          show={showLogout}
          handleCancel={toggleLogout}
          handleConfirm={handleLogout}
          title="로그아웃"
          content="로그아웃 하시겠습니까?"
        />
        <Modal
          show={showWithdraw}
          handleCancel={toggleWithdraw}
          handleConfirm={handleWithdraw}
          title="탈퇴하기"
          content={"30일 이내 복귀시 탈퇴 자동 취소되며\n탈퇴 완료시 기존 정보 모두 소멸 됩니다.\n탈퇴 하시겠습니까?"}
        />
      </div>
    </>
  );
};

export default MyPage;
