import { useRouter } from "next/navigation";
import BlockBtn from "@/components/button/BlockBtn";
import Image from "@/components/ui/FallbackImage";
import ApplicationSectionTitle from "../_components/ApplicationSectionTitle";

const DoneStep = () => {
  const router = useRouter();
  return (
    <div className="mt-24 px-5">
      <div className="rounded-lg bg-white px-6 py-8 text-center shadow-sdwB">
        <div className="flex justify-center">
          <Image src="/images/survey-complete-icon.png" width={120} height={120} alt="지원 완료" />
        </div>
        <ApplicationSectionTitle
          className="mt-4"
          title="학교 지원이 완료되었어요"
          description="지원자 현황에서 경쟁률을 바로 확인할 수 있어요."
        />
      </div>

      <div className="mt-6 flex w-full flex-col gap-3">
        <BlockBtn
          onClick={() => {
            router.push("/university/application");
          }}
        >
          지원자 현황 보기
        </BlockBtn>
        <BlockBtn
          onClick={() => {
            router.push("/");
          }}
        >
          홈으로
        </BlockBtn>
      </div>
    </div>
  );
};

export default DoneStep;
