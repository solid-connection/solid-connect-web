"use client";

import Link from "next/link";
import { useState } from "react";

import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import useJWTParseRouteHandler from "@/lib/hooks/useJWTParseRouteHandler";
import { IconLikeFill } from "@/public/svgs/mentor";
import { IconGraduationPrimary, IconInterestUniversity } from "@/public/svgs/my";

const MyProfileContent = () => {
  const { isLoading, isMentor } = useJWTParseRouteHandler();
  const [profileData] = useState({
    name: "배고픈 치와와님",
    status: isMentor ? "Mentor" : "Mentee",
    level: "관심지역",
    region: "프랑스",
    email: "solidconnection@gmail.com",
    profileImage: null,
  });
  const { name, status, level, region, email, profileImage } = profileData;

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
      <div className="rounded-lg bg-white shadow-sm">
        <h2 className="border-b p-4 text-lg font-semibold">내 지원 정보</h2>

        <Link href="/my/admission" className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <svg width="16" height="16" fill="currentColor" className="text-blue-600">
                <path d="M8 0L10.6 5.4L16 6.2L12 10.1L12.9 15.5L8 13L3.1 15.5L4 10.1L0 6.2L5.4 5.4L8 0Z" />
              </svg>
            </div>
            <span className="text-gray-700">관심 국가 변경</span>
          </div>
          <svg width="16" height="16" fill="none" stroke="currentColor" className="text-gray-400">
            <path d="M6 9L10 5L6 1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <Link href="/my/school" className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
              <svg width="16" height="16" fill="currentColor" className="text-orange-600">
                <path d="M12 3L1 9L12 15L21 12.18V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9Z" />
              </svg>
            </div>
            <span className="text-gray-700">{isMentor ? "수학 국가 변경" : "지원 학교 변경"}</span>
          </div>
          <svg width="16" height="16" fill="none" stroke="currentColor" className="text-gray-400">
            <path d="M6 9L10 5L6 1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <Link href="/my/language" className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <svg width="16" height="16" fill="currentColor" className="text-green-600">
                <path d="M3 5H9L11 3H21V5H13L11 7H3V5ZM5 9H19V11H5V9ZM7 13H17V15H7V13Z" />
              </svg>
            </div>
            <span className="text-gray-700">공인 어학 / 학점 변경</span>
          </div>
          <svg width="16" height="16" fill="none" stroke="currentColor" className="text-gray-400">
            <path d="M6 9L10 5L6 1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Account Management Section */}
      <div className="rounded-lg bg-white shadow-sm">
        <h2 className="border-b p-4 text-lg font-semibold">계정 관리</h2>

        <Link href="/my/account" className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <svg width="16" height="16" fill="currentColor" className="text-gray-600">
                <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z" />
              </svg>
            </div>
            <div>
              <div className="text-gray-700">로그인한 계정</div>
              <div className="text-sm text-gray-500">{profileData.email}</div>
            </div>
          </div>
          <svg width="16" height="16" fill="none" stroke="currentColor" className="text-gray-400">
            <path d="M6 9L10 5L6 1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <Link href="/my/password" className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
              <svg width="16" height="16" fill="currentColor" className="text-yellow-600">
                <path d="M0 0H16V3H0V0ZM0 5H16V8H0V5ZM0 10H16V13H0V10Z" />
              </svg>
            </div>
            <span className="text-gray-700">비밀번호 변경</span>
          </div>
          <svg width="16" height="16" fill="none" stroke="currentColor" className="text-gray-400">
            <path d="M6 9L10 5L6 1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Additional Options */}
      <div className="rounded-lg bg-white shadow-sm">
        <Link href="/terms" className="flex items-center justify-between border-b p-4">
          <span className="text-gray-700">서비스 이용약관</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" className="text-gray-400">
            <path d="M6 9L10 5L6 1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <Link href="/privacy" className="flex items-center justify-between border-b p-4">
          <span className="text-gray-700">고객센터 문의</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" className="text-gray-400">
            <path d="M6 9L10 5L6 1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <Link href="/inquiry" className="flex items-center justify-between border-b p-4">
          <span className="text-gray-700">회원탈퇴</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" className="text-gray-400">
            <path d="M6 9L10 5L6 1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <Link href="/logout" className="flex items-center justify-between p-4">
          <span className="text-gray-700">로그아웃</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" className="text-gray-400">
            <path d="M6 9L10 5L6 1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
};
export default MyProfileContent;
