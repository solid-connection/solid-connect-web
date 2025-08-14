"use client";

import StudyDate from "@/components/mentor/StudyDate";
import ChannelBadge from "@/components/ui/ChannelBadge";
import MentoProfile from "@/components/ui/ProfileWithBadge";

import useModifyHookForm from "./_hooks/useModifyHookForm";
import usePutMyMentorProfileHandler from "./_hooks/usePutMyMentorProfileHandler";
import AddArticleCard from "./_ui/AddArticleCard";
import MentoArticlePanel from "./_ui/ArticlePanel";
import ChannelSelect from "./_ui/ChannelSelct";

import useGetArticleList from "@/api/article/client/useGetArticleList";
import useGetMyMentorProfile from "@/api/mentor/client/useGetMentorMyProfile";
import { IconUserPrimaryColor } from "@/public/svgs/mentor";

const ModifyContent = () => {
  const { data: myMentorProfile = null } = useGetMyMentorProfile();
  const myId = myMentorProfile?.id || 0;
  const { data: articleList = [] } = useGetArticleList(myId);

  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
  } = useModifyHookForm(myMentorProfile);

  const { onSubmit } = usePutMyMentorProfileHandler();

  if (!myMentorProfile) return null; // myMentorProfile가 없으면 아무것도 렌더링하지 않음
  const { profileImageUrl, hasBadge, menteeCount, nickname, country, universityName, term, channels } = myMentorProfile;

  return (
    <div className="px-5">
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
        <div className="mt-[40px]">
          <h2 className="mb-[10px] text-lg leading-normal text-primary-1">내 채널 관리</h2>
          {/* 4개의 고정된 채널 입력 필드 */}
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="mb-6">
              <div className="flex h-[26px] w-[70px] items-center justify-center overflow-hidden rounded-2xl">
                <ChannelBadge channelType={channels[index]?.type || ""} text={`내 채널${index + 1}`} />
              </div>
              <h2 className="mt-[10px] text-base font-medium text-k-700">채널 선택</h2>
              <ChannelSelect control={control} name={`channels.${index}.type`} />
              {errors.channels?.[index]?.type && (
                <p className="mt-1 text-sm text-red-500">
                  {typeof errors.channels[index]?.type === "object" && errors.channels[index]?.type?.message
                    ? errors.channels[index]?.type?.message
                    : "채널을 선택해주세요"}
                </p>
              )}

              <h2 className="mt-5 text-[16px] font-medium text-k-700">링크 삽입</h2>
              <input
                {...register(`channels.${index}.url`)}
                className="mt-2 h-[45px] w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-light text-k-300"
                placeholder="URL을 입력해주세요."
              />
              {errors.channels?.[index]?.url && (
                <p className="mt-1 text-sm text-red-500">
                  {typeof errors.channels[index]?.url === "object" && errors.channels[index]?.url?.message
                    ? errors.channels[index]?.url?.message
                    : "URL을 입력해주세요"}
                </p>
              )}
            </div>
          ))}
          <h2 className="mt-[40px] text-lg leading-normal text-primary-1">멘토 한마디</h2>
          <textarea
            {...register("introduction")}
            className="mt-[10px] h-[120px] w-full rounded-lg bg-k-50 p-5 text-sm font-light text-k-300"
            placeholder="최대 200자 이내"
          />
          {errors.introduction && (
            <p className="mt-1 text-sm text-red-500">
              {typeof errors.introduction === "object" && errors.introduction.message
                ? errors.introduction.message
                : "멘토 한마디를 입력해주세요"}
            </p>
          )}
          <h2 className="mt-[40px] text-lg leading-normal text-primary-1">합격 레시피</h2>
          <textarea
            {...register("passTip")}
            className="mt-[10px] h-[120px] w-full rounded-lg bg-k-50 p-5 text-sm font-light text-k-300"
            placeholder="최대 200자 이내"
          />
          {errors.passTip && (
            <p className="mt-1 text-sm text-red-500">
              {typeof errors.passTip === "object" && errors.passTip.message
                ? errors.passTip.message
                : "합격 레시피를 입력해주세요"}
            </p>
          )}{" "}
          <h2 className="mt-[40px] text-lg leading-normal text-primary-1">멘토 아티클</h2>
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
            <button type="submit" className="mb-10 h-[40px] w-[150px] rounded-3xl bg-primary-1 px-5 py-[10px] text-k-0">
              수정하기
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ModifyContent;
