"use client";

import Link from "next/link";
import { FormProvider } from "react-hook-form";
import { useGetMyInfo } from "@/apis/MyPage";
import { useGetMentorMyProfile } from "@/apis/mentor";
import { useGetArticleList } from "@/apis/news";
import StudyDate from "@/components/mentor/StudyDate";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import MentoProfile from "@/components/ui/ProfileWithBadge";
import { UserRole } from "@/types/mentor";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import useModifyHookForm from "./_hooks/useModifyHookForm";
import usePutMyMentorProfileHandler from "./_hooks/usePutMyMentorProfileHandler";
import AddArticleCard from "./_ui/AddArticleCard";
import ArticlePanel from "./_ui/ArticlePanel";
import ChannelBox from "./_ui/ChannelBox";

const ModifyContent = () => {
  const { data: myInfo, isPending: isMyInfoPending, isError: isMyInfoError } = useGetMyInfo();
  const canEditMentorProfile = myInfo?.role === UserRole.MENTOR || myInfo?.role === UserRole.ADMIN;
  const {
    data: myMentorProfile = null,
    isPending,
    isError,
    refetch,
  } = useGetMentorMyProfile({
    enabled: canEditMentorProfile,
    skipGlobalErrorToast: true,
  });
  const { data: articleList = [] } = useGetArticleList(myMentorProfile?.id || 0, {
    enabled: canEditMentorProfile && !!myMentorProfile?.id,
  });
  const isDesktop = useIsDesktopViewport();

  const method = useModifyHookForm(myMentorProfile);
  const { onSubmit } = usePutMyMentorProfileHandler();

  if (isMyInfoPending || (canEditMentorProfile && isPending) || isDesktop === null) return <CloudSpinnerPage />;

  if (isMyInfoError || !canEditMentorProfile || isError || !myMentorProfile) {
    return <MentorModifyUnavailableState onRetry={() => refetch()} />;
  }

  const viewProps: ModifyContentViewProps = {
    method,
    onSubmit,
    myMentorProfile,
    articleList,
  };

  return isDesktop ? <ModifyDesktopView {...viewProps} /> : <ModifyMobileView {...viewProps} />;
};

type ModifyContentViewProps = {
  method: ReturnType<typeof useModifyHookForm>;
  onSubmit: ReturnType<typeof usePutMyMentorProfileHandler>["onSubmit"];
  myMentorProfile: NonNullable<ReturnType<typeof useGetMentorMyProfile>["data"]>;
  articleList: NonNullable<ReturnType<typeof useGetArticleList>["data"]>;
};

const ModifyDesktopView = ({ method, onSubmit, myMentorProfile, articleList }: ModifyContentViewProps) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = method;
  const { profileImageUrl, hasBadge, nickname, country, universityName, term, channels } = myMentorProfile;

  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="desktop-page-shell">
          <header className="mb-8">
            <p className="text-primary typo-sb-9">Mentor</p>
            <h1 className="mt-2 text-k-900 typo-bold-1">멘토 정보 수정</h1>
            <p className="mt-2 max-w-2xl text-k-500 typo-medium-2">
              멘토 채널과 소개, 아티클을 정리해서 멘티에게 보여줄 프로필을 관리하세요.
            </p>
          </header>

          <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
            <main className="grid gap-6">
              <section className="rounded-lg border border-k-100 bg-white p-6">
                <h2 className="text-primary-1 typo-sb-5">내 채널 관리</h2>
                <div className="mt-2.5 grid gap-3">
                  <ChannelBox channels={channels} />
                </div>
              </section>

              <section className="rounded-lg border border-k-100 bg-white p-6">
                <h2 className="text-primary-1 typo-sb-5">멘토 소개</h2>
                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  <div>
                    <label htmlFor="mentor-introduction" className="text-k-900 typo-sb-7">
                      멘토 한마디
                    </label>
                    <textarea
                      id="mentor-introduction"
                      {...register("introduction")}
                      className="mt-2.5 h-40 w-full rounded-lg bg-k-50 p-5 text-k-900 placeholder:text-k-300 typo-regular-2"
                      placeholder="최대 200자 이내"
                      maxLength={200}
                    />
                    {errors.introduction && (
                      <p className="mt-1 text-red-500 typo-regular-2">
                        {typeof errors.introduction === "object" && errors.introduction.message
                          ? errors.introduction.message
                          : "멘토 한마디를 입력해주세요"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="mentor-pass-tip" className="text-k-900 typo-sb-7">
                      합격 레시피
                    </label>
                    <textarea
                      id="mentor-pass-tip"
                      {...register("passTip")}
                      className="mt-2.5 h-40 w-full rounded-lg bg-k-50 p-5 text-k-900 placeholder:text-k-300 typo-regular-2"
                      placeholder="최대 200자 이내"
                      maxLength={200}
                    />
                    {errors.passTip && (
                      <p className="mt-1 text-red-500 typo-regular-2">
                        {typeof errors.passTip === "object" && errors.passTip.message
                          ? errors.passTip.message
                          : "합격 레시피를 입력해주세요"}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-k-100 bg-white p-6">
                <h2 className="text-primary-1 typo-sb-5">멘토 아티클</h2>
                <div className="mt-2.5">
                  <AddArticleCard />
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  {articleList.map((article) => (
                    <ArticlePanel key={article.title} userId={myMentorProfile.id} article={article} />
                  ))}
                </div>
              </section>
            </main>

            <aside className="desktop-sticky-panel rounded-lg border border-k-100 bg-white p-6">
              <h2 className="text-k-900 typo-bold-4">나의 멘토</h2>
              <div className="mt-5 flex items-start gap-4">
                <MentoProfile profileImageUrl={profileImageUrl} hasBadge={hasBadge} />
                <div className="min-w-0">
                  <div className="text-primary typo-sb-7">{country}</div>
                  <div className="mt-1 text-gray-900 typo-sb-5">{nickname}</div>
                  <div className="mt-1 text-gray-500 typo-regular-2">{universityName}</div>
                  <div className="mt-2">
                    <StudyDate term={term} />
                  </div>
                </div>
              </div>
              <button type="submit" className="mt-6 h-10 w-full rounded-3xl bg-primary-1 px-5 py-2.5 text-k-0">
                수정하기
              </button>
            </aside>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

const ModifyMobileView = ({ method, onSubmit, myMentorProfile, articleList }: ModifyContentViewProps) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = method;
  const { profileImageUrl, hasBadge, nickname, country, universityName, term, channels } = myMentorProfile;

  return (
    <div className="px-5">
      <FormProvider {...method}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="gap-4">
            <h1 className="text-gray-900 typo-sb-5">나의 멘토</h1>
            <div className="flex gap-4">
              <div className="mt-5 flex flex-col items-start gap-2">
                <MentoProfile profileImageUrl={profileImageUrl} hasBadge={hasBadge} />
              </div>
              <div className="flex flex-col gap-[8px]">
                <div className="text-primary typo-sb-7">{country}</div>
                <div className="text-gray-900 typo-sb-5">{nickname}</div>
                <div className="text-gray-500 typo-regular-2">{universityName}</div>
                <StudyDate term={term} />
              </div>
            </div>
          </div>
          <div className="mt-10 pb-36">
            <h2 className="mb-2.5 text-primary-1 typo-sb-5">내 채널 관리</h2>
            <ChannelBox channels={channels} />
            <h2 className="mt-10 text-primary-1 typo-sb-5">멘토 한마디</h2>
            <textarea
              {...register("introduction")}
              className="mt-2.5 h-30 w-full rounded-lg bg-k-50 p-5 text-k-900 placeholder:text-k-300 typo-regular-2"
              placeholder="최대 200자 이내"
              maxLength={200}
            />
            {errors.introduction && (
              <p className="mt-1 text-red-500 typo-regular-2">
                {typeof errors.introduction === "object" && errors.introduction.message
                  ? errors.introduction.message
                  : "멘토 한마디를 입력해주세요"}
              </p>
            )}
            <h2 className="mt-10 text-primary-1 typo-sb-5">합격 레시피</h2>
            <textarea
              {...register("passTip")}
              className="mt-2.5 h-30 w-full rounded-lg bg-k-50 p-5 text-k-900 placeholder:text-k-300 typo-regular-2"
              placeholder="최대 200자 이내"
              maxLength={200}
            />
            {errors.passTip && (
              <p className="mt-1 text-red-500 typo-regular-2">
                {typeof errors.passTip === "object" && errors.passTip.message
                  ? errors.passTip.message
                  : "합격 레시피를 입력해주세요"}
              </p>
            )}{" "}
            <h2 className="mt-10 text-primary-1 typo-sb-5">멘토 아티클</h2>
            <div className="mb-6">
              <AddArticleCard />
            </div>
            {articleList.map((article) => (
              <div key={article.title} className="mb-6">
                <ArticlePanel userId={myMentorProfile?.id} article={article} />
              </div>
            ))}
          </div>

          <div className="pointer-events-none fixed bottom-20 left-1/2 z-20 flex w-full -translate-x-1/2 justify-center">
            <div className="pointer-events-auto px-5">
              <button type="submit" className="h-10 w-37.5 rounded-3xl bg-primary-1 px-5 py-2.5 text-k-0">
                수정하기
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

const MentorModifyUnavailableState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
    <p className="text-k-900 typo-sb-5">멘토 프로필을 수정할 수 없어요.</p>
    <p className="mt-2 max-w-md text-k-500 typo-regular-2">
      멘토 권한이 있거나 멘토 전환이 완료된 계정에서만 프로필을 수정할 수 있습니다.
    </p>
    <div className="mt-5 flex flex-wrap justify-center gap-2">
      <button type="button" onClick={onRetry} className="rounded-lg border border-k-100 px-4 py-2 text-k-700 typo-sb-9">
        다시 시도
      </button>
      <Link href="/my/apply-mentor" className="rounded-lg bg-primary px-4 py-2 text-k-0 typo-sb-9">
        멘토 전환 신청하기
      </Link>
    </div>
  </div>
);

export default ModifyContent;
