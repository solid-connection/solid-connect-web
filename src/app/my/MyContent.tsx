"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { deleteAccountApi, signOutApi } from "@/services/auth";
import { getMyInfoApi } from "@/services/myInfo";
import { authProviderName } from "@/utils/authUtils";

import ConfirmCancelModal from "@/components/modal/ConfirmCancelModal";

import { MyInfo } from "@/types/myInfo";

import MyInfoCard from "@/app/my/MyInfoCard";
import MyMenu from "@/app/my/MyMenu";
import MyMenuGroup from "@/app/my/MyMenuGroup";
import { IconMyMenuCalendar, IconMyMenuLock, IconMyMenuPerson } from "@/public/svgs/my";

const roleDisplay = {
  MENTO: "Mento",
  MENTEE: "Mentee",
};

const MyContent = () => {
  const router = useRouter();
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);
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
            if (err.response.status === 401 || err.response.status === 403) {
              router.push("/login");
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
        router.push("/");
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
      <div>
        <div className="mb-5 ml-5 mt-10 flex h-[54px] gap-3">
          <div>
            <img
              className="h-[54px] w-[54px] rounded-full object-cover"
              src={
                myInfo.profileImageUrl
                  ? `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${myInfo.profileImageUrl}`
                  : "/images/placeholder/profile64.svg"
              }
              alt="프로필"
            />
          </div>
          <div className="flex flex-col gap-[5px]">
            <div className="flex items-end items-center gap-2">
              <span className="text-base font-semibold text-k-900">{myInfo.nickname || "닉네임"}</span>
              <div className="flex items-center justify-center rounded-full bg-primary-100 px-3 py-1">
                <span className="text-[11px] font-semibold leading-normal text-primary">
                  {myInfo.role in roleDisplay ? roleDisplay[myInfo.role] : "Mentee"}
                </span>
              </div>
            </div>

            <div className="text-sm font-medium leading-normal text-k-400">INHA Univ</div>
          </div>
        </div>

        <div className="mx-5 mb-5">
          <MyInfoCard scrapCount={0} interestMentoCount={0} wishUniversityCount={0} />
        </div>
        <div>
          <MyMenuGroup icon={<IconMyMenuPerson />} subject="내 정보">
            <Link href="/my/modify">
              <MyMenu text="프로필 관리" />
            </Link>
            <Link href="/score">
              <MyMenu text="공인어학/학점 변경" />
            </Link>
            <Link href="/application/apply">
              <MyMenu text="지원학교 변경" />
            </Link>
          </MyMenuGroup>
          <MyMenuGroup icon={<IconMyMenuCalendar />} subject="내 활동">
            <Link href="/my">
              <MyMenu text="활동 내역" />
            </Link>
            <Link href="/mento">
              <MyMenu text="멘토 지원" />
            </Link>
          </MyMenuGroup>
          <MyMenuGroup icon={<IconMyMenuLock />} subject="내 계정">
            <div className="flex h-[30px] items-center justify-between pl-5 pr-10">
              <span className="text-sm font-normal leading-normal text-k-800">솔커 계정</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-k-500">{authProviderName(myInfo.authType)} 로그인</span>
                <span className="text-xs font-medium text-k-500">{myInfo.email}</span>
              </div>
            </div>
            <div onClick={toggleLogout}>
              <MyMenu text="로그아웃" isArrowVisible={false} />
            </div>
            <div onClick={toggleWithdraw}>
              <MyMenu text="회원탈퇴" isArrowVisible={false} />
            </div>
            <Link href={process.env.NEXT_PUBLIC_CONTACT_LINK || ""} target="_blank">
              <div className="flex h-[30px] items-center justify-between pl-5 pr-10">
                <span className="text-sm font-normal leading-normal text-k-800">문의하기</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5 text-[10px] font-semibold text-k-500">
                    카카오톡 오픈채팅방
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                      <path
                        d="M6.45801 2.74967L7.37467 1.83301C7.83301 1.37467 8.74967 1.37467 9.20801 1.83301L9.66634 2.29134C10.1247 2.74967 10.1247 3.66634 9.66634 4.12467L7.37467 6.41634C6.91634 6.87467 5.99967 6.87467 5.54134 6.41634M5.54134 8.24967L4.62467 9.16634C4.16634 9.62467 3.24967 9.62467 2.79134 9.16634L2.33301 8.70801C1.87467 8.24967 1.87467 7.33301 2.33301 6.87467L4.62467 4.58301C5.08301 4.12467 5.99967 4.12467 6.45801 4.58301"
                        stroke="#76797D"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </MyMenuGroup>
        </div>

        <ConfirmCancelModal
          isOpen={showLogout}
          handleCancel={toggleLogout}
          handleConfirm={handleLogout}
          title="로그아웃"
          content="로그아웃 하시겠습니까?"
        />
        <ConfirmCancelModal
          isOpen={showWithdraw}
          handleCancel={toggleWithdraw}
          handleConfirm={handleWithdraw}
          title="탈퇴하기"
          content={"30일 이내 복귀시 탈퇴 자동 취소되며\n탈퇴 완료시 기존 정보 모두 소멸 됩니다.\n탈퇴 하시겠습니까?"}
        />
      </div>
    </>
  );
};

export default MyContent;
