"use client";

import Link from "next/link";
import { useState } from "react";

import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import LinkedTextWithIcon from "@/components/ui/LinkedTextWithIcon";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import useJWTParseRouteHandler from "@/lib/hooks/useJWTParseRouteHandler";
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

const MyProfileContent = () => {
  const { isLoading, isMentor } = useJWTParseRouteHandler();
  const [profileData] = useState({
    name: "배고픈 치와와님",
    email: "solidconnection@gmail.com",
    profileImage: null,
  });
  const { name, email, profileImage } = profileData;

  if (isLoading) return <CloudSpinnerPage />;

  return (
    <div className="px-5 py-2">
      <div className="mb-4 text-start text-lg font-semibold text-k-700">
        <p>{name}님은</p>
        <p>
          현재 <span className="font-medium text-primary">{isMentor ? "멘토" : "멘티"}</span> 솔커예요.
        </p>
      </div>
      {/* Profile Section */}
      {/* Profile Card */}
      <div className="mb-4 rounded-lg bg-gray-50 p-4">
        <div className="mb-3 flex items-center space-x-3">
          <ProfileWithBadge profileImageUrl={profileImage} width={48} height={48} />
          <div>
            <div className="flex items-center gap-3 space-x-2">
              <h3 className="text-lg font-semibold text-primary">배고픈 치와와</h3>
              <span
                className={`rounded-2xl px-2 py-1 text-xs font-medium ${
                  isMentor ? "bg-sub-d-100 text-sub-d-500" : "bg-sub-e-100 text-sub-e-500"
                }`}
              >
                {isMentor ? "Mentor" : "Mentee"}
              </span>
            </div>
            <p className="mt-2 text-sm text-k-600">
              {isMentor ? "수학학교" : "관심지역"} |{" "}
              <span className="font-semibold text-primary">{isMentor ? "뉴욕주립대학교 스토니브룩" : "프랑스"}</span>
            </p>
          </div>
        </div>

        {isMentor ? (
          <button className="w-full rounded-lg bg-secondary-500 py-2 font-medium text-white">프로필 변경</button>
        ) : (
          <div className="mt-4 flex items-center justify-between gap-3">
            <button className="w-full rounded-lg bg-secondary-500 py-2 font-medium text-white">프로필 변경</button>
            <button className="w-full rounded-lg bg-secondary-800 py-2 font-medium text-white">멘토 회원 전환</button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-k-700">
        <Link href="/my/university" className="p-3 text-center">
          <div className="mx-auto mb-2 h-8 w-8">
            <IconInterestUniversity />
          </div>
          관심학교
        </Link>
        <Link href="/my/favorites" className="p-3 text-center">
          <div className="mx-auto mb-2 h-8 w-8">
            <IconLikeFill />
          </div>
          좋아요한 글
        </Link>
        <Link href="/my/mentors" className="p-3 text-center">
          <div className="mx-auto mb-2 h-8 w-8">
            <IconGraduationPrimary />
          </div>
          {isMentor ? "메칭 멘티" : "메칭 멘토"}
        </Link>
      </div>

      {/* My Information Section */}
      <div className="mt-6">
        <div className="px-4">
          <h2 className="text-lg font-semibold text-primary">내 지원 정보</h2>
        </div>

        <LinkedTextWithIcon href="/my/country" icon={<IconEarth />} text="관심 국가 변경" textColor="text-k-700" />

        <LinkedTextWithIcon
          href="/my/university"
          icon={<IconUniversity />}
          text="지원 학교 변경"
          textColor="text-k-700"
        />

        <LinkedTextWithIcon
          href="/my/language"
          icon={<IconBook />}
          text="공인 어학 / 학점 변경"
          textColor="text-k-700"
        />
      </div>

      {/* Account Management Section */}
      <div className="mt-6">
        <div className="px-4">
          <h2 className="text-lg font-semibold text-primary">계정 관리</h2>
        </div>

        <LinkedTextWithIcon
          href="/my/account"
          icon={<IconLock />}
          text="로그인한 계정"
          subText={email}
          textColor="text-k-700"
        />

        <LinkedTextWithIcon href="/my/password" icon={<IconPassword />} text="비밀번호 변경" textColor="text-k-700" />
      </div>

      {/* Additional Options */}
      <div className="mt-5">
        <LinkedTextWithIcon href="/terms" text="서비스 이용약관" textColor="text-k-700" />

        <LinkedTextWithIcon href="/customer-service" text="고객센터 문의" textColor="text-k-700" />

        <LinkedTextWithIcon href="/withdrawal" text="회원탈퇴" textColor="text-k-700" />

        <LinkedTextWithIcon href="/logout" text="로그아웃" textColor="text-k-700" />
      </div>
    </div>
  );
};
export default MyProfileContent;
