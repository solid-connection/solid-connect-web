import Image from "@/components/ui/FallbackImage";

interface TitleSectionProps {
  logoUrl: string;
  title: string;
  subTitle: string;
}

const TitleSection = ({ logoUrl, title, subTitle }: TitleSectionProps) => {
  return (
    <div className="flex justify-center pt-10 md:justify-start md:pt-8">
      <div className="flex min-w-0 gap-2.5">
        <Image
          src={logoUrl}
          alt="대학 로고"
          width={48}
          height={48}
          className="rounded-full object-cover"
          fallbackSrc="/svgs/placeholders/university-logo-placeholder.svg"
        />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-k-900 typo-sb-4" title={title}>
            {title}
          </span>
          <span className="truncate text-k-400 typo-medium-1" title={subTitle}>
            {subTitle}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TitleSection;
