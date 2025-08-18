"use client";

import Link from "next/link";
import { useState } from "react";

import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";

import useJWTParseRouteHandler from "@/lib/hooks/useJWTParseRouteHandler";

const MyProfileContent = () => {
  const { isLoading, isMentor } = useJWTParseRouteHandler();
  const [profileData] = useState({
    name: "배고픈 치와와님",
    status: isMentor ? "Mentor" : "Mentee",
    level: "관심지역",
    region: "프랑스",
    email: "solidconnection@gmail.com",
    profileImage: "/images/placeholder/profile-placeholder.png",
  });

  if (isLoading) return <CloudSpinnerPage />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center border-b bg-white px-4 py-3">
        <Link href="/my" className="mr-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">마이페이지</h1>
      </div>

      <div className="space-y-6 p-4">
        {/* Profile Section */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 text-center">
            <p className="mb-2 text-gray-600">배고픈 치와와님은</p>
            <p className="text-gray-600">
              현재 <span className="font-medium text-blue-500">{isMentor ? "멘토" : "멘티"}</span> 솔커예요.
            </p>
          </div>

          {/* Profile Card */}
          <div className="mb-4 rounded-lg bg-gray-50 p-4">
            <div className="mb-3 flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="#666"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    stroke="#666"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">배고픈 치와와</h3>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      isMentor ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {isMentor ? "Mentor" : "Mento"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {isMentor ? "수학학과" : "관심지역"} | {isMentor ? "뉴욕주립대학교 스토니브룩" : "프랑스"}
                </p>
              </div>
            </div>

            <button className="w-full rounded-lg bg-blue-500 py-2 font-medium text-white">프로필 변경</button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            <Link href="/my/university" className="p-3 text-center">
              <div className="mx-auto mb-2 h-8 w-8 text-orange-500">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9L12 15L21 12.18V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700">관심학교</span>
            </Link>
            <Link href="/my/favorites" className="p-3 text-center">
              <div className="mx-auto mb-2 h-8 w-8 text-red-500">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700">좋아요한 글</span>
            </Link>
            <Link href="/my/mentors" className="p-3 text-center">
              <div className="mx-auto mb-2 h-8 w-8 text-blue-500">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4C18.2091 4 20 5.79086 20 8C20 10.2091 18.2091 12 16 12C13.7909 12 12 10.2091 12 8C12 5.79086 13.7909 4 16 4ZM16 14C20.4183 14 24 15.7909 24 18V20H8V18C8 15.7909 11.5817 14 16 14ZM8 13C10.2091 13 12 11.2091 12 9C12 6.79086 10.2091 5 8 5C5.79086 5 4 6.79086 4 9C4 11.2091 5.79086 13 8 13ZM8 15C3.58172 15 0 16.7909 0 19V21H6V19C6 17.3409 6.94071 15.8619 8.35418 15H8Z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700">{isMentor ? "메칭 멘티" : "메칭 멘토"}</span>
            </Link>
          </div>
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
    </div>
  );
};
export default MyProfileContent;
