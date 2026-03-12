import Image from "@/components/ui/FallbackImage";

interface TitleSectionProps {
  logoUrl: string;
  title: string;
  subTitle: string;
}

const TitleSection = ({ logoUrl, title, subTitle }: TitleSectionProps) => {
  return (
    <div className="flex justify-center pt-10">
      <div className="flex gap-2.5">
        <Image
          src={logoUrl}
          alt="대학 로고"
          width={48}
          height={48}
          className="rounded-full object-cover"
          fallbackSrc="/svgs/placeholders/university-logo-placeholder.svg"
        />
        <div className="flex flex-col">
          <span className="text-k-900 typo-sb-4">{title}</span>
          <span className="text-center text-k-400 typo-medium-1">{subTitle}</span>
        </div>
      </div>
    </div>
  );
};

export default TitleSection;
