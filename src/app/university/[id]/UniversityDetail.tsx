import Image from "next/image";

import { convertImageUrl } from "@/utils/fileUtils";

import LinkifyText from "@/components/ui/LinkifyText";

import InfoSection from "./InfoSection";
import LanguageSection from "./LanguageSection";
import MapSection from "./MapSection";
import TitleSection from "./TitleSection";
import UniversityBtns from "./UniversityBtns";

import { University } from "@/types/university";

interface UniversityDetailProps {
  university: University;
  koreanName: string;
}

const UniversityDetail = ({ university, koreanName }: UniversityDetailProps) => {
  return (
    <div className="relative">
      <div className="absolute top-4 flex w-full justify-between gap-3 px-5">
        <UniversityBtns universityId={university.id} />
      </div>

      <div className="relative -z-10 h-60 w-full bg-blue-100">
        <Image alt="대학 이미지" src={convertImageUrl(university.backgroundImageUrl)} fill className="object-cover" />
      </div>
      <div className="z-30 -mt-16 rounded-t-3xl bg-white px-5">
        <TitleSection
          title={koreanName}
          subTitle={university.englishName}
          logoUrl={convertImageUrl(university.logoImageUrl)}
        />
        {/* TODO: totalDispatchCount 추가시 연동, 나라에 국기 추가 */}
        <div className="mb-7 mt-10 flex justify-center divide-x">
          <span className="px-[30px] text-sm font-semibold leading-normal text-k-900">{}0회 파견</span>
          <span className="px-[30px] text-sm font-semibold leading-normal text-k-900">{university.country}</span>
          <span className="px-[30px] text-sm font-semibold leading-normal text-k-900">
            모집 {university.studentCapacity}명
          </span>
        </div>
        <LanguageSection
          detailsForLanguage={university.detailsForLanguage}
          languageRequirements={university.languageRequirements}
        />
        <InfoSection
          semesterRequirement={university.semesterRequirement}
          semesterAvailableForDispatch={university.semesterAvailableForDispatch}
          detailsForApply={university.detailsForApply}
          detailsForAccommodation={university?.detailsForAccommodation}
        />
        <div className="h-1 bg-k-50" />
        <div className="my-7 px-3">
          <div className="mb-3 text-base font-semibold text-k-900">전공상세</div>
          <div className="break-words text-sm font-medium leading-normal text-k-600">
            <LinkifyText>{university?.detailsForMajor}</LinkifyText>
          </div>
        </div>
        <div className="h-1 bg-k-50" />
        <div className="my-7 px-3">
          <div className="mb-3 text-base font-semibold text-k-900">영어강의 리스트</div>
          <div>
            <span className="break-words text-sm font-medium leading-normal text-k-600">
              <LinkifyText>{university?.detailsForEnglishCourse}</LinkifyText>
            </span>
          </div>
        </div>
        <MapSection universityEnglishName={university.englishName} />
        <div className="h-48" />
      </div>
    </div>
  );
};

export default UniversityDetail;
