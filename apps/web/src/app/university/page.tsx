import type { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { HOME_UNIVERSITY_LIST } from "@/constants/university";

import HomeUniversityCard from "./(home)/_ui/HomeUniversityCard";

export const revalidate = 3600; // 1시간마다 재검증 (ISR)

export const metadata: Metadata = {
  title: "대학 선택 | 솔리드커넥션",
  description: "소속 대학교를 선택하여 교환학생 정보를 확인하세요.",
};

const UniversitySelectPage = () => {
  return (
    <>
      <TopDetailNavigation title="대학교 선택" />
      <div className="flex min-h-[calc(100vh-112px)] flex-col px-5 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-k-900 typo-bold-1">소속 대학교 선택</h1>
          <p className="text-k-500 typo-medium-4">
            소속 대학교를 선택하면
            <br />
            해당 대학의 교환학생 정보를 확인할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          {HOME_UNIVERSITY_LIST.map((university) => (
            <HomeUniversityCard key={university.slug} university={university} />
          ))}
        </div>
      </div>
    </>
  );
};

export default UniversitySelectPage;
