import type { Metadata } from "next";

import { HOME_UNIVERSITY_LIST } from "@/constants/university";
import { createUrl } from "@/utils/seo";

import HomeUniversityCard from "./_ui/HomeUniversityCard";

export const revalidate = false;

export const metadata: Metadata = {
  title: "대학 선택 | 솔리드커넥션",
  description: "소속 대학교를 선택하여 교환학생 정보를 확인하세요.",
  alternates: {
    canonical: createUrl("/university"),
  },
  openGraph: {
    title: "대학 선택 | 솔리드커넥션",
    description: "소속 대학교를 선택하여 교환학생 정보를 확인하세요.",
    url: createUrl("/university"),
    siteName: "솔리드커넥션",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: createUrl("/opengraph-image.png"),
        width: 1200,
        height: 630,
        alt: "솔리드커넥션 대학 선택",
      },
    ],
  },
};

const UniversitySelectPage = () => {
  return (
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
  );
};

export default UniversitySelectPage;
