import Image from "next/image";

interface TitleSectionProps {
  logoUrl: string;
  title: string;
  subTitle: string;
}

const TitleSection = ({ logoUrl, title, subTitle }: TitleSectionProps) => {
  return (
    <div className="flex justify-center pt-10">
      <div className="flex gap-2.5">
        <Image src={logoUrl} alt="대학 로고" width={48} height={48} className="rounded-full" />
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-k-900">{title}</span>
          <span className="text-center text-base font-medium text-k-400">{subTitle}</span>
        </div>
      </div>
    </div>
  );
};

export default TitleSection;
