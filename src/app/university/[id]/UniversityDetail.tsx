import Image from "next/image";

import EnglishSection from "./EnglishSection";
import InfoSection from "./InfoSection";
import LanguageSection from "./LanguageSection";
import MajorSection from "./MajorSection";
import SubTitleSection from "./SubTitleSection";
import TitleSection from "./TitleSection";

const UniversityDetail = () => {
  return (
    <>
      <UniversityImage imageUrl="images/boras_univ.png" />
      <UniversityInfo />
    </>
  );
};

export default UniversityDetail;

const UniversityImage = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <div className="h-[236px] bg-blue-100 object-cover">
      <Image alt="대학 이미지" src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${imageUrl}`} width={600} height={300} />
    </div>
  );
};

const UniversityInfo = () => {
  return (
    <div className="-mt-[66px] rounded-t-3xl px-5">
      <TitleSection title="보라스 대학교" subTitle="Boras Univ." logoUrl="/images/boras_univ_logo.png" />
      <SubTitleSection totalDispatchCount={21} country="스웨덴" studentCapacity={2} />
      <LanguageSection />
      <InfoSection />
      <MajorSection majorDetail="https://www.hb.se" />
      <EnglishSection englishDetail="https://www.hb.se/en/education/international-students/" />
    </div>
  );
};
