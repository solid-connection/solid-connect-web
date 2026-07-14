"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useDeleteUserAccount, usePostLogout } from "@/apis/Auth";
import { useGetMyInfo } from "@/apis/MyPage";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import LinkedTextWithIcon from "@/components/ui/LinkedTextWithIcon";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";
import { showIconToast } from "@/lib/toast/showIconToast";
import useAuthStore from "@/lib/zustand/useAuthStore";
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
import { UserRole } from "@/types/mentor";
import { openKakaoOpenChat } from "@/utils/openKakaoOpenChat";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";

const NEXT_PUBLIC_CONTACT_LINK = process.env.NEXT_PUBLIC_CONTACT_LINK;

type MyProfileViewProps = {
  nickname?: string;
  email?: string;
  profileImageUrl?: string | null;
  roleLabel: string;
  roleBadgeClassName: string;
  viewAsMentor: boolean;
  university: string | null;
  favoriteLocation: string;
  handleContactClick: () => void;
  handleDeleteUserAccount: () => void;
  handleLogout: () => void;
};

const MyProfileContent = () => {
  const router = useRouter();
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const shouldFetchProfile = isInitialized && isAuthenticated;
  const { data: profileData, isLoading, isFetching, isError, refetch } = useGetMyInfo({ enabled: shouldFetchProfile });
  const { mutate: deleteUserAccount } = useDeleteUserAccount();
  const { mutate: postLogout } = usePostLogout();
  const clientRole = useAuthStore((state) => state.clientRole);
  const isDesktop = useIsDesktopViewport();

  useEffect(() => {
    if (!isInitialized || isAuthenticated) return;

    router.replace("/login");
  }, [isInitialized, isAuthenticated, router]);

  if (isError) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-k-700 typo-medium-2">마이페이지 정보를 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full bg-primary px-4 py-2 text-white typo-medium-2"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!shouldFetchProfile || isLoading || (isFetching && !profileData) || !profileData) {
    return <CloudSpinnerPage />;
  }

  const { nickname, email, profileImageUrl } = profileData;
  const isMentor = profileData.role === UserRole.MENTOR || profileData.role === UserRole.ADMIN;
  const viewAsMentor = clientRole ? clientRole === UserRole.MENTOR : isMentor;
  const roleLabel = profileData.role === UserRole.ADMIN ? "Admin" : isMentor ? "Mentor" : "Mentee";
  const roleBadgeClassName =
    profileData.role === UserRole.ADMIN
      ? "bg-red-100 text-red-600"
      : isMentor
        ? "bg-sub-d-100 text-sub-d-500"
        : "bg-sub-e-100 text-sub-e-500";

  const university =
    profileData.role === UserRole.MENTOR || profileData.role === UserRole.ADMIN ? profileData.attendedUniversity : null;
  const favoriteLocation =
    profileData.role === UserRole.MENTEE ? profileData.interestedCountries.slice(0, 3).join(", ") || "없음" : "없음";

  const handleContactClick = () => {
    if (!NEXT_PUBLIC_CONTACT_LINK) {
      showIconToast("logo", "고객센터 링크를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    openKakaoOpenChat(NEXT_PUBLIC_CONTACT_LINK);
  };

  const handleDeleteUserAccount = () => {
    if (confirm("정말 탈퇴하시겠습니까? 탈퇴 시 모든 데이터가 삭제되며, 복구할 수 없습니다.")) {
      deleteUserAccount();
    }
  };

  const viewProps = {
    nickname,
    email,
    profileImageUrl,
    roleLabel,
    roleBadgeClassName,
    viewAsMentor,
    university,
    favoriteLocation,
    handleContactClick,
    handleDeleteUserAccount,
    handleLogout: () => postLogout(),
  };

  if (isDesktop === null) {
    return <div aria-hidden className="min-h-screen bg-white md:bg-k-50" />;
  }

  return isDesktop ? <MyProfileDesktopView {...viewProps} /> : <MyProfileMobileView {...viewProps} />;
};

const MyProfileMobileView = ({
  nickname,
  email,
  profileImageUrl,
  roleLabel,
  roleBadgeClassName,
  viewAsMentor,
  university,
  favoriteLocation,
  handleContactClick,
  handleDeleteUserAccount,
  handleLogout,
}: MyProfileViewProps) => {
  const displayName = nickname || "회원";

  return (
    <div className="py-2">
      <div className="mb-4 text-start text-k-700 typo-sb-5">
        <p>{displayName}님은</p>
        <p>
          현재{" "}
          <span className="text-primary typo-sb-5">
            {roleLabel === "Admin" ? "어드민" : viewAsMentor ? "멘토" : "멘티"}
          </span>{" "}
          솔커예요.
        </p>
      </div>

      <div className="mb-4 rounded-lg bg-k-50 p-4">
        <div className="mb-3 flex items-center space-x-3">
          <ProfileWithBadge profileImageUrl={profileImageUrl} isMentor={viewAsMentor} width={48} height={48} />
          <div>
            <div className="flex items-center gap-3 space-x-2">
              <h3 className="text-primary typo-sb-5">{displayName}</h3>
              <span className={`rounded-2xl px-2 py-1 typo-medium-4 ${roleBadgeClassName}`}>{roleLabel}</span>
            </div>
            <p className="mt-2 text-k-600 typo-regular-2">
              {viewAsMentor ? "수학학교" : "관심지역"} |{" "}
              <span className="text-primary typo-sb-9">{viewAsMentor ? university : favoriteLocation}</span>
            </p>
          </div>
        </div>

        {viewAsMentor ? (
          <Link
            href="/my/modify"
            className="block w-full rounded-lg bg-secondary-500 py-2 text-center text-white typo-medium-2"
          >
            프로필 변경
          </Link>
        ) : (
          <div className="mt-4 flex items-center justify-between gap-3">
            <Link
              href="/my/modify"
              className="block w-full rounded-lg bg-secondary-500 py-2 text-center text-white typo-medium-2"
            >
              프로필 변경
            </Link>
            <Link
              href="/my/apply-mentor"
              className="w-full rounded-lg bg-secondary-800 py-2 text-center text-white typo-medium-2"
            >
              멘토 회원 전환
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 text-k-700 typo-sb-9">
        <Link href="/my/favorite" className="p-3 text-center">
          <div className="mx-auto mb-2 h-8 w-8">
            <IconInterestUniversity />
          </div>
          관심학교
        </Link>
        <button onClick={() => showIconToast("logo", "현재 불가능한 서비스입니다")} className="p-3 text-center">
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

      <div className="mt-6">
        <h2 className="px-1 text-primary typo-sb-5">내 지원 정보</h2>
        <LinkedTextWithIcon
          onClick={() => showIconToast("logo", "현재 불가능한 서비스입니다")}
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

      <div className="mt-6">
        <h2 className="px-1 text-primary typo-sb-5">계정 관리</h2>
        <LinkedTextWithIcon href="/my/school-email" icon={<IconUniversity />} text="학교 인증" />
        <LinkedTextWithIcon icon={<IconLock />} text="로그인한 계정" subText={email} />
        <LinkedTextWithIcon href="/my/password" icon={<IconPassword />} text="비밀번호 변경" />
      </div>

      <div className="mt-5 flex flex-col gap-0.5">
        <LinkedTextWithIcon href="/terms" text="서비스 이용약관" />
        <LinkedTextWithIcon onClick={handleContactClick} text="고객센터 문의" />
        <LinkedTextWithIcon onClick={handleDeleteUserAccount} text="회원탈퇴" />
        <LinkedTextWithIcon onClick={handleLogout} text="로그아웃" />
      </div>
    </div>
  );
};

const MyProfileDesktopView = ({
  nickname,
  email,
  profileImageUrl,
  roleLabel,
  roleBadgeClassName,
  viewAsMentor,
  university,
  favoriteLocation,
  handleContactClick,
  handleDeleteUserAccount,
  handleLogout,
}: MyProfileViewProps) => {
  const displayName = nickname || "회원";
  const statusText = viewAsMentor ? university || "수학학교 미등록" : favoriteLocation;

  return (
    <div className="desktop-page-shell">
      <header className="mb-8">
        <p className="text-primary typo-sb-9">My Solid</p>
        <h1 className="mt-2 text-k-900 typo-bold-1">마이페이지</h1>
        <p className="mt-2 text-k-500 typo-medium-2">프로필, 지원 정보, 계정 설정을 한 곳에서 관리하세요.</p>
      </header>

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-6">
          <section className="rounded-lg border border-k-100 bg-white p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-5">
                <ProfileWithBadge profileImageUrl={profileImageUrl} isMentor={viewAsMentor} width={86} height={86} />
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-3">
                    <h2 className="truncate text-k-900 typo-bold-2">{displayName}</h2>
                    <span className={`rounded-full px-3 py-1 typo-medium-4 ${roleBadgeClassName}`}>{roleLabel}</span>
                  </div>
                  <p className="mt-2 text-k-500 typo-medium-3">
                    {viewAsMentor ? "수학학교" : "관심지역"} · <span className="text-primary">{statusText}</span>
                  </p>
                  {email && <p className="mt-1 truncate text-k-400 typo-medium-4">{email}</p>}
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  href="/my/modify"
                  className="rounded-lg bg-secondary-500 px-4 py-3 text-white transition-colors typo-sb-9 hover:bg-secondary-600"
                >
                  프로필 변경
                </Link>
                {!viewAsMentor && (
                  <Link
                    href="/my/apply-mentor"
                    className="rounded-lg bg-secondary-800 px-4 py-3 text-white transition-colors typo-sb-9 hover:bg-secondary-900"
                  >
                    멘토 회원 전환
                  </Link>
                )}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-3 gap-4">
            <DesktopQuickAction href="/my/favorite" icon={<IconInterestUniversity />} title="관심학교" />
            <DesktopQuickAction
              onClick={() => showIconToast("logo", "현재 불가능한 서비스입니다")}
              icon={<IconLikeFill />}
              title="좋아요한 글"
            />
            <DesktopQuickAction
              href="/my/match"
              icon={<IconGraduationPrimary />}
              title={viewAsMentor ? "매칭 멘티" : "매칭 멘토"}
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <DesktopPanel title="내 지원 정보">
              <DesktopMenuItem
                onClick={() => showIconToast("logo", "현재 불가능한 서비스입니다")}
                icon={<IconEarth />}
                title={viewAsMentor ? "수학 국가 변경" : "관심 국가 변경"}
              />
              <DesktopMenuItem
                href="/university/application/apply"
                icon={<IconUniversity />}
                title={viewAsMentor ? "수학 중/완료 학교 변경" : "지원 학교 변경"}
              />
              <DesktopMenuItem href="/university/score" icon={<IconBook />} title="공인 어학 / 학점 변경" />
            </DesktopPanel>

            <DesktopPanel title="계정 관리">
              <DesktopMenuItem href="/my/school-email" icon={<IconUniversity />} title="학교 인증" />
              <DesktopMenuItem icon={<IconLock />} title="로그인한 계정" subText={email} />
              <DesktopMenuItem href="/my/password" icon={<IconPassword />} title="비밀번호 변경" />
            </DesktopPanel>
          </section>
        </main>

        <aside className="desktop-sticky-panel rounded-lg border border-k-100 bg-white p-6">
          <h2 className="text-k-900 typo-bold-4">도움말 및 계정</h2>
          <div className="mt-5 divide-y divide-k-50">
            <DesktopTextAction href="/terms" title="서비스 이용약관" />
            <DesktopTextAction onClick={handleContactClick} title="고객센터 문의" />
            <DesktopTextAction onClick={handleDeleteUserAccount} title="회원탈퇴" tone="danger" />
            <DesktopTextAction onClick={handleLogout} title="로그아웃" />
          </div>
        </aside>
      </div>
    </div>
  );
};

const DesktopQuickAction = ({
  href,
  onClick,
  icon,
  title,
}: {
  href?: string;
  onClick?: () => void;
  icon: ReactNode;
  title: string;
}) => {
  const content = (
    <div className="flex h-32 flex-col justify-between rounded-lg border border-k-100 bg-white p-5 text-k-700 transition-transform hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary [&>svg]:h-6 [&>svg]:w-6">
        {icon}
      </div>
      <span className="typo-sb-7">{title}</span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  if (!onClick) {
    return content;
  }

  return (
    <button type="button" onClick={onClick} className="text-left">
      {content}
    </button>
  );
};

const DesktopPanel = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="rounded-lg border border-k-100 bg-white p-6">
    <h2 className="text-k-900 typo-bold-4">{title}</h2>
    <div className="mt-5 grid gap-3">{children}</div>
  </section>
);

const DesktopMenuItem = ({
  href,
  onClick,
  icon,
  title,
  subText,
}: {
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  title: string;
  subText?: string;
}) => {
  const content = (
    <div className="flex items-center justify-between rounded-lg bg-k-50 px-4 py-3 text-k-700 transition-colors hover:bg-k-100">
      <div className="flex min-w-0 items-center gap-3">
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white [&>svg]:h-5 [&>svg]:w-5">
            {icon}
          </span>
        )}
        <span className="truncate typo-medium-2">{title}</span>
      </div>
      {subText && <span className="ml-4 max-w-52 truncate text-k-500 typo-regular-2">{subText}</span>}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  if (!onClick) {
    return content;
  }

  return (
    <button type="button" onClick={onClick} className="text-left">
      {content}
    </button>
  );
};

const DesktopTextAction = ({
  href,
  onClick,
  title,
  tone = "default",
}: {
  href?: string;
  onClick?: () => void;
  title: string;
  tone?: "default" | "danger";
}) => {
  const className = tone === "danger" ? "text-accent-custom-red" : "text-k-700";
  const content = <span className={`block py-4 typo-medium-2 ${className}`}>{title}</span>;

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
};

export default MyProfileContent;
