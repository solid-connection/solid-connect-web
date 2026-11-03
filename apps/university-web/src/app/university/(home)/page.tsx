import type { Metadata } from "next";

import { HOME_UNIVERSITY_LIST } from "@/constants/university";
import { createUrl } from "@/utils/seo";

import HomeUniversityCard, { DesktopHomeUniversityCard } from "./_ui/HomeUniversityCard";

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
    <>
      <div className="flex min-h-[calc(100vh-112px)] flex-col px-5 py-8 md:hidden">
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

      <div className="hidden min-h-screen bg-k-50 px-8 py-8 md:block lg:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8">
            <p className="text-primary typo-sb-9">University catalog</p>
            <h1 className="mt-2 text-k-900 typo-bold-1">소속 대학교 선택</h1>
            <p className="mt-2 text-k-500 typo-medium-2">
              내 학교 기준으로 파견 가능 대학, 지원 조건, 상세 정보를 확인하세요.
            </p>
          </header>

          <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
            <section className="rounded-lg border border-k-100 bg-white p-6">
              <h2 className="text-k-900 typo-bold-4">학교별 교환학생 정보</h2>
              <p className="mt-1 text-k-500 typo-medium-3">
                소속 학교를 선택하면 해당 학교 학생에게 맞는 파견 학교 목록으로 이동합니다.
              </p>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {HOME_UNIVERSITY_LIST.map((university) => (
                  <DesktopHomeUniversityCard key={university.slug} university={university} />
                ))}
              </div>
            </section>

            <aside className="sticky top-8 rounded-lg border border-k-100 bg-white p-6">
              <h2 className="text-k-900 typo-bold-4">이렇게 확인해요</h2>
              <div className="mt-5 grid gap-3 text-k-700 typo-medium-2">
                <div className="rounded-lg bg-k-50 px-4 py-3">소속 학교를 먼저 선택합니다.</div>
                <div className="rounded-lg bg-k-50 px-4 py-3">지역, 국가, 어학 조건으로 학교를 좁혀봅니다.</div>
                <div className="rounded-lg bg-k-50 px-4 py-3">상세 페이지에서 모집 인원과 지원 요건을 확인합니다.</div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default UniversitySelectPage;
