"use client";

import { FormProvider } from "react-hook-form";

import StudyDate from "@/components/mentor/StudyDate";
import MentoProfile from "@/components/ui/ProfileWithBadge";

import useModifyHookForm from "./_hooks/useModifyHookForm";
import usePutMyMentorProfileHandler from "./_hooks/usePutMyMentorProfileHandler";
import AddArticleCard from "./_ui/AddArticleCard";
import MentoArticlePanel from "./_ui/ArticlePanel";
import ChannelBox from "./_ui/ChannelBox";

import useGetMyMentorProfile from "@/api/mentor/client/useGetMentorMyProfile";
import useGetArticleList from "@/api/news/client/useGetArticleList";
import { IconUserPrimaryColor } from "@/public/svgs/mentor";

const ModifyContent = () => {
  const { data: myMentorProfile = null } = useGetMyMentorProfile();

  const { data: articleList = [] } = useGetArticleList(myMentorProfile?.id || null);

  const method = useModifyHookForm(myMentorProfile);
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = method;

  const { onSubmit } = usePutMyMentorProfileHandler();
  // 채널 타입들을 감시

  if (!myMentorProfile) return null; // myMentorProfile가 없으면 아무것도 렌더링하지 않음
  const { profileImageUrl, hasBadge, menteeCount, nickname, country, universityName, term, channels } = myMentorProfile;

  return (
    <div className="px-5">
      <FormProvider {...method}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Profile Header */}
          <div className="gap-4">
            <h1 className="text-lg font-semibold text-gray-900">나의 멘토</h1>
            <div className="flex gap-4">
              <div className="flex flex-col items-start gap-2">
                <MentoProfile profileImageUrl={profileImageUrl} hasBadge={hasBadge} />
                <div className="flex items-center gap-2 text-sm leading-normal text-primary">
                  <span className="h-[16px] w-[16px]">
                    <IconUserPrimaryColor />
                  </span>
                  누적 멘티 : {menteeCount}
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                <div className="text-sm text-gray-500">{country}</div>
                <div className="text-lg font-semibold text-gray-900">{nickname}</div>
                <div className="text-sm text-gray-500">{universityName}</div>
                <StudyDate term={term} />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <h2 className="mb-2.5 text-lg leading-normal text-primary-1">내 채널 관리</h2>
            <ChannelBox channels={channels} />
            {/* 4개의 고정된 채널 입력 필드 */}
            <h2 className="mt-10 text-lg leading-normal text-primary-1">멘토 한마디</h2>
            <textarea
              {...register("introduction")}
              className="h-30 mt-2.5 w-full rounded-lg bg-k-50 p-5 text-sm font-light text-k-300"
              placeholder="최대 200자 이내"
            />
            {errors.introduction && (
              <p className="mt-1 text-sm text-red-500">
                {typeof errors.introduction === "object" && errors.introduction.message
                  ? errors.introduction.message
                  : "멘토 한마디를 입력해주세요"}
              </p>
            )}
            <h2 className="mt-10 text-lg leading-normal text-primary-1">합격 레시피</h2>
            <textarea
              {...register("passTip")}
              className="h-30 mt-2.5 w-full rounded-lg bg-k-50 p-5 text-sm font-light text-k-300"
              placeholder="최대 200자 이내"
            />
            {errors.passTip && (
              <p className="mt-1 text-sm text-red-500">
                {typeof errors.passTip === "object" && errors.passTip.message
                  ? errors.passTip.message
                  : "합격 레시피를 입력해주세요"}
              </p>
            )}{" "}
            <h2 className="mt-10 text-lg leading-normal text-primary-1">멘토 아티클</h2>
            {articleList.map((article) => (
              <div key={article.title} className="mb-6">
                <MentoArticlePanel article={article} />
              </div>
            ))}
            {/* 새 아티클 추가 버튼 */}
            <div className="mb-6">
              <AddArticleCard />
            </div>
            <div className="mt-20 flex justify-center">
              <button type="submit" className="w-37.5 mb-10 h-10 rounded-3xl bg-primary-1 px-5 py-2.5 text-k-0">
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
