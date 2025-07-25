"use client";

import { useForm } from "react-hook-form";

import StudyDate from "@/components/mentor/StudyDate";
import ChannelBadge from "@/components/ui/ChannelBadge";
import MentoProfile from "@/components/ui/ProfileWithBadge";

import { MentoModifyFormData, mentoModifySchema } from "./_lib/mentoModifyScehma";
import AddArticleCard from "./_ui/AddArticleCard";
import MentoArticlePanel from "./_ui/ArticlePanel";
import ChannelSelect from "./_ui/ChannelSelct";
import ModifyBtnPanel from "./_ui/ModalBtnPanel";

import { ChannelType } from "@/types/mentor";

import useGetArticleList from "@/api/article/client/useGetAriticleList";
import useGetMyMentorProfile from "@/api/mentor/client/useGetMyMentorProfile";
import { IconUserPrimaryColor } from "@/public/svgs/mentor";
import { zodResolver } from "@hookform/resolvers/zod";

const ModifyContent = () => {
  const { myMentorProfile } = useGetMyMentorProfile();
  const { articleList } = useGetArticleList(myMentorProfile.id);

  const { profileImageUrl, hasBadge, menteeCount, nickname, country, universityName, studyStatus } = myMentorProfile;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MentoModifyFormData>({
    resolver: zodResolver(mentoModifySchema),
    defaultValues: {
      channels: Object.values(ChannelType).map(() => ({ type: "", link: "" })),
      mentorMessage: "",
      successRecipe: "",
    },
  });

  // 폼 제출 핸들러
  const onSubmit = (data: MentoModifyFormData) => {
    // TODO 여기에 폼 제출 로직을 추가
    console.log("폼이 제출되었습니다.", data);
  };

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
              <StudyDate studyStatus={studyStatus} />
            </div>
          </div>
        </div>
        <div className="mt-[40px]">
          <h2 className="mb-[10px] text-lg leading-normal text-primary-1">내 채널 관리</h2>
          {/* 채널타입으로 뱃지 색상 구분 */}
          {Object.values(ChannelType).map((channelType, index) => (
            <div key={index} className="mb-6">
              <div className="flex h-[26px] w-[70px] items-center justify-center overflow-hidden rounded-2xl">
                <ChannelBadge channerType={channelType} text={`내 채널${index + 1}`} />
              </div>
              <h2 className="mt-[10px] text-[16px] font-medium text-k-700">채널 선택</h2>
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
                {...register(`channels.${index}.link`)}
                className="mt-2 h-[45px] w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-light text-k-300"
                placeholder="링크를 입력해주세요."
              />
              {errors.channels?.[index]?.link && (
                <p className="mt-1 text-sm text-red-500">
                  {typeof errors.channels[index]?.link === "object" && errors.channels[index]?.link?.message
                    ? errors.channels[index]?.link?.message
                    : "링크를 입력해주세요"}
                </p>
              )}
            </div>
          ))}
          <h2 className="mt-[40px] text-lg leading-normal text-primary-1">멘토 한마디</h2>
          <textarea
            {...register("mentorMessage")}
            className="mt-[10px] h-[120px] w-full rounded-lg bg-k-50 p-5 text-sm font-light text-k-300"
            placeholder="최대 200자 이내"
          />
          {errors.mentorMessage && (
            <p className="mt-1 text-sm text-red-500">
              {typeof errors.mentorMessage === "object" && errors.mentorMessage.message
                ? errors.mentorMessage.message
                : "멘토 한마디를 입력해주세요"}
            </p>
          )}
          <h2 className="mt-[40px] text-lg leading-normal text-primary-1">합격 레시피</h2>
          <textarea
            {...register("successRecipe")}
            className="mt-[10px] h-[120px] w-full rounded-lg bg-k-50 p-5 text-sm font-light text-k-300"
            placeholder="최대 200자 이내"
          />
          {errors.successRecipe && (
            <p className="mt-1 text-sm text-red-500">
              {typeof errors.successRecipe === "object" && errors.successRecipe.message
                ? errors.successRecipe.message
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
            <ModifyBtnPanel onSubmit={handleSubmit(onSubmit)} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ModifyContent;
