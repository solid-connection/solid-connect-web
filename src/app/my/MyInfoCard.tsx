import Link from "next/link";

import { IconMyInfoCardArrow } from "@/public/svgs/my";

type MyInfoCardProps = {
  scarpCount: number;
  interestMentoCount: number;
  wishUniversityCount: number;
};

const MyInfoCard = ({ scarpCount, interestMentoCount, wishUniversityCount }: MyInfoCardProps) => (
  <div className="flex h-[58px] items-center justify-center gap-5 rounded-lg bg-primary py-4">
    <MyInfoCardItem title="스크랩" count={`${scarpCount}개`} link="" />
    <MyInfoCardItem title="관심 멘토" count={`${interestMentoCount}명`} link="" />
    <MyInfoCardItem title="위시학교" count={`${wishUniversityCount}개`} link="/my/favorite/" />
  </div>
);

export default MyInfoCard;

type MyInfoCardItemProps = {
  title: string;
  count: string;
  link: string;
};

const MyInfoCardItem = ({ title, count, link }: MyInfoCardItemProps) => (
  <Link href={link} className="flex flex-col items-center">
    <div className="flex items-center gap-1">
      <span className="font-serif text-[13px] font-semibold text-white">{title}</span>
      <IconMyInfoCardArrow />
    </div>
    <span className="font-serif text-base font-semibold text-white">{count}</span>
  </Link>
);
