"use client";

import Link from "next/link";

import LinkedTextWithIcon from "@/components/ui/LinkedTextWithIcon";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import { UserRole } from "@/types/mentor";

import useDeleteUserAccount from "@/api/auth/client/useDeleteUserAccount";
import usePostLogout from "@/api/auth/client/usePostLogout";
import useGetMyInfo from "@/api/my/client/useGetMyInfo";
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
  const { data: profileData = {} } = useGetMyInfo();
  const { mutate: deleteUserAccount } = useDeleteUserAccount();
  const { mutate: postLogout } = usePostLogout();

  const { nickname, email, profileImageUrl } = profileData;

  const university = profileData.role === UserRole.MENTOR ? profileData.attendedUniversity : null;
  const favoriteLocation =
    profileData.role === UserRole.MENTEE ? profileData.interestedCountries?.slice(0, 3).join(", ") || "없음" : null;
  const isMentor = profileData.role === UserRole.MENTOR;

  return (
    <div className="px-5 py-2">
      <div className="mb-4 text-start text-lg font-semibold text-k-700">
        <p>{nickname}님은</p>
        <p>
          현재 <span className="font-medium text-primary">{isMentor ? "멘토" : "멘티"}</span> 솔커예요.
        </p>
      </div>
      {/* Profile Card */}
      <div className="mb-4 rounded-lg bg-gray-50 p-4">
        <div className="mb-3 flex items-center space-x-3">
          <ProfileWithBadge profileImageUrl={profileImageUrl} width={48} height={48} />
          <div>
            <div className="flex items-center gap-3 space-x-2">
              <h3 className="text-lg font-semibold text-primary">{nickname}</h3>
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
              <span className="font-semibold text-primary">{isMentor ? university : favoriteLocation}</span>
            </p>
          </div>
        </div>

        {isMentor ? (
          <div className="w-full rounded-lg bg-secondary-500 py-2 text-center font-medium text-white">
            <Link href={"/my/modify"}>프로필 변경</Link>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="w-full rounded-lg bg-secondary-500 py-2 text-center font-medium text-white">
              <Link href={"/my/modify"}>프로필 변경</Link>
            </div>
            <button
              onClick={() => {
                alert("멘토 회원 전환은 현재 불가합니다.");
              }}
              className="w-full rounded-lg bg-secondary-800 py-2 font-medium text-white"
            >
              멘토 회원 전환
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-k-700">
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
        <button onClick={() => alert("현재 불가합니다.")} className="p-3 text-center">
          <div className="mx-auto mb-2 h-8 w-8">
            <IconLikeFill />
          </div>
          좋아요한 글
        </button>
        <Link href="/my/match" className="p-3 text-center">
          <div className="mx-auto mb-2 h-8 w-8">
            <IconGraduationPrimary />
          </div>
          {isMentor ? "메칭 멘티" : "메칭 멘토"}
        </Link>
      </div>

      {/* My Information Section */}
      <div className="mt-6">
        <h2 className="px-1 text-lg font-semibold text-primary">내 지원 정보</h2>

        <LinkedTextWithIcon
          onClick={() => alert("현재 불가합니다.")}
          icon={<IconEarth />}
          text={isMentor ? "수학 국가 변경" : "관심 국가 변경"}
        />

        <LinkedTextWithIcon
          href="/university/application/apply"
          icon={<IconUniversity />}
          text={isMentor ? "수학 중/완료 학교 변경" : "지원 학교 변경"}
        />

        <LinkedTextWithIcon href="/university/score" icon={<IconBook />} text="공인 어학 / 학점 변경" />
      </div>

      {/* Account Management Section */}
      <div className="mt-6">
        <h2 className="px-1 text-lg font-semibold text-primary">계정 관리</h2>

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
