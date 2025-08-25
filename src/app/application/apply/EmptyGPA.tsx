import Link from "next/link";

import { IconSolidConnectionSmallLogo } from "@/public/svgs/my";

const EmptyGPA = () => {
  return (
    <div className="mt-52 flex flex-col items-center justify-center gap-2 rounded-lg text-center">
      <IconSolidConnectionSmallLogo />
      <p className="text-k-300">
        지원할 수 있는 성적이 없어요.
        <br />
        성적부터 입력해 볼까요?
      </p>
      <Link
        href="/score"
        className="h- mt-2 h-13 w-60 rounded-full bg-gradient-to-l from-primary to-secondary p-4 text-sm font-semibold text-white"
      >
        성적 등록하러가기
      </Link>
    </div>
  );
};
export default EmptyGPA;
