import Image from "next/image";

import { convertImageUrl } from "@/utils/fileUtils";

import EnglishSection from "./EnglishSection";
import InfoSection from "./InfoSection";
import LanguageSection from "./LanguageSection";
import MajorSection from "./MajorSection";
import MapSection from "./MapSection";
import SubTitleSection from "./SubTitleSection";
import TitleSection from "./TitleSection";

import { University } from "@/types/university";

interface UniversityDetailProps {
  university: University;
  koreanName: string;
}

const UniversityDetail = ({ university, koreanName }: UniversityDetailProps) => {
  console.log("university", university);
  return (
    <div className="relative">
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
        <SubTitleSection
          totalDispatchCount={0}
          country={university.country}
          studentCapacity={university.studentCapacity}
        />
        <LanguageSection
          detailsForLanguage={university.detailsForLanguage}
          languageRequirements={university.languageRequirements}
        />
        <InfoSection
          semesterRequirement={university.semesterRequirement}
          semesterAvailableForDispatch={university.semesterAvailableForDispatch}
          detailsForApply={university.detailsForApply}
          detailsForAccommodation={university.detailsForAccommodation}
        />
        <MajorSection majorDetail={university.detailsForMajor} />
        <EnglishSection englishDetail={university.detailsForEnglishCourse} />
        <MapSection universityEnglishName={university.englishName} />
        <div className="h-48" />
      </div>
    </div>
  );
};

export default UniversityDetail;
