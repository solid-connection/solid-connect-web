"use client";

import { FormProvider } from "react-hook-form";
import { useGetMentorMyProfile } from "@/apis/mentor";
import { useGetArticleList } from "@/apis/news";
import StudyDate from "@/components/mentor/StudyDate";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import MentoProfile from "@/components/ui/ProfileWithBadge";
import { IconUserPrimaryColor } from "@/public/svgs/mentor";
import useModifyHookForm from "./_hooks/useModifyHookForm";
import usePutMyMentorProfileHandler from "./_hooks/usePutMyMentorProfileHandler";
import AddArticleCard from "./_ui/AddArticleCard";
import ArticlePanel from "./_ui/ArticlePanel";
import ChannelBox from "./_ui/ChannelBox";

const ModifyContent = () => {
  const { data: myMentorProfile = null } = useGetMentorMyProfile();
  const { data: articleList = [] } = useGetArticleList(myMentorProfile?.id || 0);

  const method = useModifyHookForm(myMentorProfile);
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = method;

  const { onSubmit } = usePutMyMentorProfileHandler();
  // 채널 타입들을 감시
  if (!myMentorProfile) return <CloudSpinnerPage />;
  const { profileImageUrl, hasBadge, menteeCount, nickname, country, universityName, term, channels } = myMentorProfile;

  return (
    <div className="px-5">
      <FormProvider {...method}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Profile Header */}
          <div className="gap-4">
            <h1 className="text-gray-900 typo-sb-5">나의 멘토</h1>
            <div className="flex gap-4">
              <div className="flex flex-col items-start gap-2">
                <MentoProfile profileImageUrl={profileImageUrl} hasBadge={hasBadge} />
                <div className="flex items-center gap-2 text-primary typo-regular-2">
                  <span className="h-[16px] w-[16px]">
                    <IconUserPrimaryColor />
                  </span>
                  누적 멘티 : {menteeCount}
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                <div className="text-gray-500 typo-regular-2">{country}</div>
                <div className="text-gray-900 typo-sb-5">{nickname}</div>
                <div className="text-gray-500 typo-regular-2">{universityName}</div>
                <StudyDate term={term} />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <h2 className="mb-2.5 text-primary-1 typo-sb-5">내 채널 관리</h2>
            <ChannelBox channels={channels} />
            {/* 4개의 고정된 채널 입력 필드 */}
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
            {articleList.map((article) => (
              <div key={article.title} className="mb-6">
                <ArticlePanel userId={myMentorProfile?.id} article={article} />
              </div>
            ))}
            {/* 새 아티클 추가 버튼 */}
            <div className="mb-6">
              <AddArticleCard />
            </div>
            <div className="mt-20 flex justify-center">
              <button type="submit" className="mb-10 h-10 w-37.5 rounded-3xl bg-primary-1 px-5 py-2.5 text-k-0">
                수정하기
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ModifyContent;
