import Link from "next/link";

import { IconSolidConnectionSmallLogo } from "@/public/svgs/my";
import ApplicationSectionTitle from "../_components/ApplicationSectionTitle";

const EmptyGPA = () => {
  return (
    <div className="mt-24 px-5">
      <div className="rounded-lg bg-white px-6 py-8 text-center shadow-sdwB">
        <div className="flex justify-center">
          <IconSolidConnectionSmallLogo />
        </div>
        <ApplicationSectionTitle
          className="mt-4"
          title="지원할 수 있는 성적이 없어요"
          description="성적을 먼저 등록하면 모의지원 진행이 가능해요."
        />
      </div>
      <Link
        href="/university/score"
        className="mt-6 flex h-13 w-full items-center justify-center rounded-lg bg-primary text-white typo-medium-1"
      >
        성적 등록하러가기
      </Link>
    </div>
  );
};
export default EmptyGPA;
