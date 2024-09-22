// 현재 미사용
import Link from "next/link";

type MyStatusProps = {
  scrapCount: number;
  mentoCount: number;
  wishCollegeCount: number;
};

export default function MyStatus({ scrapCount, mentoCount, wishCollegeCount }: MyStatusProps) {
  return (
    <div className="flex h-[125px] border-b border-t border-[#d2d2d2] bg-[rgba(196,221,255,0.2)]">
      <Link className="flex w-1/2 flex-col items-center justify-center gap-3.5 no-underline" href="/my/favorite">
        <div className="font-serif text-base font-semibold text-[#7e7e7e]">스크랩</div>
        <div className="font-serif text-base font-semibold text-black">{scrapCount || 0}개</div>
      </Link>

      <Link className="flex w-1/2 flex-col items-center justify-center gap-3.5 no-underline" href="/my/favorite/">
        <div className="font-serif text-base font-semibold text-[#7e7e7e]">관심 멘토</div>
        <div className="font-serif text-base font-semibold text-black">{mentoCount || 0}명</div>
      </Link>

      <Link className="flex w-1/2 flex-col items-center justify-center gap-3.5 no-underline" href="/my/favorite/">
        <div className="font-serif text-base font-semibold text-[#7e7e7e]">위시학교</div>
        <div className="font-serif text-base font-semibold text-black">{wishCollegeCount || 0}개</div>
      </Link>
    </div>
  );
}
