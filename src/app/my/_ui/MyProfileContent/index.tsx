"use client";

import Link from "next/link";
import { useState } from "react";

import LinkedTextWithIcon from "@/components/ui/LinkedTextWithIcon";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import { UserRole } from "@/types/mentor";

import { useDeleteUserAccount, usePostLogout } from "@/apis/Auth";
import { MyInfoResponse, useGetMyInfo } from "@/apis/MyPage";
import { toast } from "@/lib/zustand/useToastStore";
import { IconLikeFill } from "@/public/svgs/mentor";
import {
  IconBook,
  IconEarth,
  IconGraduationPrimary,
  IconInterestUniversity,
  IconLock,
  IconPassword,
  IconUniversity,
} from "@/public/svgs/my";

const NEXT_PUBLIC_CONTACT_LINK = process.env.NEXT_PUBLIC_CONTACT_LINK;

const MyProfileContent = () => {
  const { data: profileData = {} as MyInfoResponse } = useGetMyInfo();
  const { mutate: deleteUserAccount } = useDeleteUserAccount();
  const { mutate: postLogout } = usePostLogout();

  const { nickname, email, profileImageUrl } = profileData;

  const isAdmin = profileData.role === UserRole.ADMIN;
  const isMentor = profileData.role === UserRole.MENTOR || profileData.role === UserRole.ADMIN;

  // 어드민 전용: 뷰 전환 상태 (true: 멘토 뷰, false: 멘티 뷰)
  const [showMentorView, setShowMentorView] = useState<boolean>(true);

  // 어드민이 아닌 경우 기존 로직대로, 어드민인 경우 토글 상태에 따라
  const viewAsMentor = isAdmin ? showMentorView : isMentor;

  const university =
    profileData.role === UserRole.MENTOR || profileData.role === UserRole.ADMIN ? profileData.attendedUniversity : null;
  const favoriteLocation =
    profileData.role === UserRole.MENTEE ? profileData.interestedCountries?.slice(0, 3).join(", ") || "없음" : null;

  return (
    <div className="px-5 py-2">
      {/* 어드민 전용 뷰 전환 버튼 */}
      {isAdmin && (
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setShowMentorView(true)}
            className={`flex-1 rounded-lg px-4 py-2.5 transition-colors typo-sb-9 ${
              showMentorView ? "bg-primary text-white" : "border border-k-200 bg-white text-k-600 hover:bg-k-50"
            }`}
          >
            멘토 뷰
          </button>
          <button
            onClick={() => setShowMentorView(false)}
            className={`flex-1 rounded-lg px-4 py-2.5 transition-colors typo-sb-9 ${
              !showMentorView ? "bg-primary text-white" : "border border-k-200 bg-white text-k-600 hover:bg-k-50"
            }`}
          >
            멘티 뷰
          </button>
        </div>
      )}

      <div className="mb-4 text-start text-k-700 typo-sb-5">
        <p>{nickname}님은</p>
        <p>
          현재{" "}
          <span className="text-primary typo-medium-2">
            {profileData.role === UserRole.ADMIN ? "어드민" : isMentor ? "멘토" : "멘티"}
          </span>{" "}
          솔커예요.
        </p>
      </div>
      {/* Profile Card */}
      <div className="mb-4 rounded-lg bg-gray-c-300 p-4">
        <div className="mb-3 flex items-center space-x-3">
          <ProfileWithBadge profileImageUrl={profileImageUrl} width={48} height={48} />
          <div>
            <div className="flex items-center gap-3 space-x-2">
              <h3 className="text-primary typo-sb-5">{nickname}</h3>
              <span
                className={`rounded-2xl px-2 py-1 typo-medium-4 ${
                  profileData.role === UserRole.ADMIN
                    ? "bg-red-100 text-red-600"
                    : isMentor
                      ? "bg-sub-d-100 text-sub-d-500"
                      : "bg-sub-e-100 text-sub-e-500"
                }`}
              >
                {profileData.role === UserRole.ADMIN ? "Admin" : isMentor ? "Mentor" : "Mentee"}
              </span>
            </div>
            <p className="mt-2 text-k-600 typo-regular-2">
              {viewAsMentor ? "수학학교" : "관심지역"} |{" "}
              <span className="text-primary typo-sb-9">{viewAsMentor ? university : favoriteLocation}</span>
            </p>
          </div>
        </div>

        {viewAsMentor ? (
          <div className="w-full cursor-pointer rounded-lg bg-secondary-500 py-2 text-center text-white typo-medium-2">
            <Link href={"/my/modify"}>프로필 변경</Link>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="w-full cursor-pointer rounded-lg bg-secondary-500 py-2 text-center text-white typo-medium-2">
              <Link href={"/my/modify"}>프로필 변경</Link>
            </div>
            {/* <Link className="w-full" href={"/my/apply-mentor"}>
              <button className="w-full rounded-lg bg-secondary-800 py-2 typo-medium-2 text-white">멘토 회원 전환</button>
            </Link> */}
            <button
              onClick={() => {
                toast.info("조금만 기다려주세요. [업데이트 중]");
              }}
              className="w-full rounded-lg bg-secondary-800 py-2 text-white typo-medium-2"
            >
              멘토 회원 전환
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 text-k-700 typo-sb-9">
        <Link href="/my/favorite" className="p-3 text-center">
          <div className="mx-auto mb-2 h-8 w-8">
            <IconInterestUniversity />
          </div>
          관심학교
        </Link>
        {/* to do 좋아요한 글 가져오기  */}
        {/* <Link href="/my/favorites" className="p-3 text-center">
          <div className="mx-auto mb-2 h-8 w-8">
            <IconLikeFill />
          </div>
          좋아요한 글
        </Link> */}
        <button onClick={() => toast.error("현재 불가합니다.")} className="p-3 text-center">
          <div className="mx-auto mb-2 h-8 w-8">
            <IconLikeFill />
          </div>
          좋아요한 글
        </button>
        <Link href="/my/match" className="p-3 text-center">
          <div className="mx-auto mb-2 h-8 w-8">
            <IconGraduationPrimary />
          </div>
          {viewAsMentor ? "매칭 멘티" : "매칭 멘토"}
        </Link>
      </div>

      {/* My Information Section */}
      <div className="mt-6">
        <h2 className="px-1 text-primary typo-sb-5">내 지원 정보</h2>

        <LinkedTextWithIcon
          onClick={() => toast.error("현재 불가합니다.")}
          icon={<IconEarth />}
          text={viewAsMentor ? "수학 국가 변경" : "관심 국가 변경"}
        />

        <LinkedTextWithIcon
          href="/university/application/apply"
          icon={<IconUniversity />}
          text={viewAsMentor ? "수학 중/완료 학교 변경" : "지원 학교 변경"}
        />

        <LinkedTextWithIcon href="/university/score" icon={<IconBook />} text="공인 어학 / 학점 변경" />
      </div>

      {/* Account Management Section */}
      <div className="mt-6">
        <h2 className="px-1 text-primary typo-sb-5">계정 관리</h2>

        <LinkedTextWithIcon icon={<IconLock />} text="로그인한 계정" subText={email} />

        <LinkedTextWithIcon href="/my/password" icon={<IconPassword />} text="비밀번호 변경" />
      </div>

      {/* Additional Options */}
      <div className="mt-5">
        <LinkedTextWithIcon href="/terms" text="서비스 이용약관" />

        <LinkedTextWithIcon isBilink href={NEXT_PUBLIC_CONTACT_LINK} text="고객센터 문의" />

        <LinkedTextWithIcon
          onClick={() => {
            if (confirm("정말 탈퇴하시겠습니까? 탈퇴 시 모든 데이터가 삭제되며, 복구할 수 없습니다."))
              deleteUserAccount();
          }}
          text="회원탈퇴"
        />

        <LinkedTextWithIcon onClick={postLogout} text="로그아웃" />
      </div>
    </div>
  );
};
export default MyProfileContent;
