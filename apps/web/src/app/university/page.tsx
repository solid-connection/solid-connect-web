import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import CheveronRightFilled from "@/components/ui/icon/ChevronRightFilled";
import { HOME_UNIVERSITIES } from "@/types/university";

export const metadata: Metadata = {
  title: "파견 학교 목록 | 대학교 선택",
  description: "교환학생 파견 대학을 선택하세요. 인하대학교, 인천대학교, 성신여자대학교의 교환학생 프로그램 정보를 확인할 수 있습니다.",
};

// ISR: 정적 페이지 생성
export const revalidate = false;

const UniversityOnboardingPage = () => {
  return (
    <>
      <TopDetailNavigation title="대학교 선택" />
      <div className="mt-14 w-full px-5 py-6">
        <h1 className="mb-2 text-k-800 typo-bold-1">파견 대학교를 선택해주세요</h1>
        <p className="mb-6 text-k-500 typo-medium-4">
          소속 대학교를 선택하면 해당 대학교의 교환학생 파견 정보를 확인할 수 있습니다.
        </p>

        <div className="flex flex-col gap-2.5">
          {HOME_UNIVERSITIES.map((university) => (
            <Link
              key={university.slug}
              href={`/university/list/${university.slug}`}
              className="block"
            >
              <div className="relative h-[91px] w-full overflow-hidden rounded-lg border border-solid border-k-100 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10">
                <div className="flex justify-between px-5 py-3.5">
                  <div className="flex gap-[23.5px]">
                    <div className="flex flex-shrink-0 items-center">
                      <Image
                        src={university.imageUrl}
                        alt={`${university.name} 이미지`}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h2 className="text-k-700 typo-bold-4">{university.name}</h2>
                      <p className="text-k-500 typo-medium-4">{university.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheveronRightFilled color="black" opacity="0.54" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default UniversityOnboardingPage;
