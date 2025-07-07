import { ChannelType } from "@/types/mentor";

interface MentoChannerProps {
  channerType: ChannelType;
}

const MentoChanner = ({ channerType }: MentoChannerProps) => {
  const getChannelStyle = () => {
    switch (channerType) {
      case ChannelType.BLOG:
        return "bg-sub-e-100"; // var(--SubE100, #E4F7C0)
      case ChannelType.BRUNCH:
        return "bg-sub-c-100"; // var(--SubC100, #FFF2DD)
      case ChannelType.INSTAGRAM:
        return "bg-sub-d-100"; // var(--SubD100, #FCEFFF)
      case ChannelType.YOUTUBE:
        return "bg-sub-f-100"; // var(--SubF100, #FFDEDF)
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div
      className={`flex h-[39px] w-full items-center justify-center gap-[10px] rounded px-2 py-[3px] ${getChannelStyle()}`}
    >
      <span className="text-sm font-medium">{channerType}</span>
    </div>
  );
};

export default MentoChanner;
