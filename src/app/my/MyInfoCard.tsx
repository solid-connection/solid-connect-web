import Link from "next/link";

import { IconMyInfoCardBookmark, IconMyInfoCardMento, IconMyInfoCardwish } from "@/public/svgs/my";

type MyInfoCardProps = {
  scrapCount: number;
  interestMentoCount: number;
  wishUniversityCount: number;
};

const MyInfoCard = ({ scrapCount, interestMentoCount, wishUniversityCount }: MyInfoCardProps) => (
  <div className="flex h-[3.75rem] items-center justify-center gap-11 rounded-lg bg-primary-500 py-4">
    <MyInfoCardItem title="스크랩" count={`${scrapCount}개`} link="" icon={<IconMyInfoCardBookmark />} />
    <MyInfoCardItem title="관심 멘토" count={`${interestMentoCount}명`} link="" icon={<IconMyInfoCardMento />} />
    <MyInfoCardItem
      title="위시학교"
      count={`${wishUniversityCount}개`}
      link="/my/favorite/"
      icon={<IconMyInfoCardwish />}
    />
  </div>
);

export default MyInfoCard;

type MyInfoCardItemProps = {
  title: string;
  count: string;
  link: string;
  icon?: React.ReactNode;
};

const MyInfoCardItem = ({ title, count, link, icon }: MyInfoCardItemProps) => (
  <Link href={link} className="flex flex-col items-center">
    <div className="flex items-center gap-1">
      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white p-0.5">{icon}</div>
      <span className="font-serif text-[13px] font-semibold text-white">{title}</span>
    </div>
    <span className="font-serif text-base font-semibold text-white">{count}</span>
  </Link>
);
