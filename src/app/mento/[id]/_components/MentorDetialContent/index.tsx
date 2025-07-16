import ChannelBadge from "@/components/ui/ChannelBadge";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";
import ToolTipMessage from "@/components/ui/TooltipMessage";

import MentoArticle from "./_components/MentoArticle";
import MentorAppliePanel from "./_components/MentorAppliePanel";

import { Article, ChannelType } from "@/types/mentor";

// 더미 채널 데이터
const channels = [{ type: ChannelType.BLOG }, { type: ChannelType.BRUNCH }];

// 더미 아티클 데이터
const articles: Article[] = [
  {
    id: 1,
    title: "교환학생 '찐' 후기",
    description: "교환학생 경험의 진솔한 이야기와 꿀팁이 가득한 '찐' 후기를 영상에서 확인하세요!",
    imageUrl: "/images/placeholder/europe-city.jpg",
    isLiked: false,
  },
  {
    id: 2,
    title: "미국 대학 준비 가이드",
    description: "미국 대학 지원을 위한 필수 준비사항과 노하우를 공유합니다.",
    imageUrl: "/images/placeholder/university.jpg",
    isLiked: true,
  },
];
const MentorDetialContent = () => {
  return (
    <>
      {/* 멘토 프로필 섹션 */}
      <div className="mt-2 flex">
        {/* 프로필 이미지 */}
        <ProfileWithBadge width={86} height={86} hasBadge={true} isBadgeUp={false} />
        <div className="ml-6 flex flex-col justify-start">
          {/* 국가 및 학교 정보 */}
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[14px] font-semibold text-primary">미국</span>
            <span className="text-[14px] font-medium text-secondary-500">수학 중인 멘토</span>
          </div>

          {/* 멘토 이름 */}
          <h1 className="mb-2 text-xl font-semibold text-k-900">김솔커님</h1>

          {/* 학교 및 전공 */}
          <p className="mb-2 text-center text-base text-k-500">노스캐롤라이나 윌밍턴대학교(A성)</p>

          {/* 연락 가능 시간 */}
          <p className="text-sm font-semibold text-k-800">방해 금지 시간</p>
          <p className="text-sm font-normal text-k-500">0:00 ~ 8:00</p>
        </div>
      </div>
      <hr className="mb-[30px] mt-[30px]" />

      {/* 멘토 한마디 */}
      <h3 className="mb-2 text-[18px] font-normal text-secondary">멘토 한마디</h3>
      <p className="mb-7 text-[14px] font-normal text-k-500">
        안녕하세요 저는 미국 노스캐롤라이나 윌밍턴대학교에서 교환학생 3학년 과정중인 김솔커입니다!
      </p>

      {/* 멘토 채널 */}
      <h3 className="mb-2 text-[18px] font-normal text-secondary">멘토 한마디</h3>
      <div className="mb-7">
        <div
          className={`grid gap-2 ${
            channels.length === 1
              ? "grid-cols-1"
              : channels.length === 2
                ? "grid-cols-2"
                : channels.length === 3
                  ? "grid-cols-2"
                  : "grid-cols-2"
          }`}
        >
          {channels.map((channel, idx) => (
            <div
              key={idx}
              className={`h-[40px] ${channels.length === 1 ? "w-full" : channels.length === 3 && idx === 2 ? "col-span-2" : ""}`}
            >
              <ChannelBadge channerType={channel.type as ChannelType} />
            </div>
          ))}
        </div>
      </div>

      {/* 합격 레시피 */}
      <h3 className="mb-2 text-[18px] font-normal text-secondary">합격 레시피</h3>
      <p className="mb-7 text-[14px] font-normal text-k-500">
        자기소개서와 등기서에 진솔한 이야기를 담아, 왜 미국에서 공부 하고 싶은지, 어떤 목표가 있는지 명확히 전달하세요.
        학교와 프로 그램에 맞는 내용을 강조하고, 자신만의 강점과 경험을 부각시...
      </p>

      {/* 멘토의 아티클 */}
      <h3 className="mb-2 text-[18px] font-normal text-secondary">멘토의 아티클</h3>

      <div className="mb-6 space-y-4">
        {articles.map((article) => (
          <MentoArticle key={article.id} article={article} />
        ))}
      </div>
      <div className="pointer-events-none fixed bottom-20 left-0 right-0 flex justify-center">
        <div className="pointer-events-auto">
          <MentorAppliePanel isDistribute={false} isAleadyMatch={false} />
        </div>
      </div>
    </>
  );
};
export default MentorDetialContent;
