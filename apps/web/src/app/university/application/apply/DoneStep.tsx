import clsx from "clsx";
import { useRouter } from "next/navigation";
import BlockBtn from "@/components/button/BlockBtn";
import Image from "@/components/ui/FallbackImage";
import ApplicationSectionTitle from "../_components/ApplicationSectionTitle";

const DoneStepBase = ({ isDesktop }: { isDesktop: boolean }) => {
  const router = useRouter();

  return (
    <div className={clsx(isDesktop ? "" : "mt-24 px-5")}>
      <div
        className={clsx("rounded-lg bg-white px-6 py-8 text-center", isDesktop ? "border border-k-100" : "shadow-sdwB")}
      >
        <div className="flex justify-center">
          <Image src="/images/survey-complete-icon.png" width={120} height={120} alt="지원 완료" />
        </div>
        <ApplicationSectionTitle
          className="mt-4"
          title="학교 지원이 완료되었어요"
          description="지원자 현황에서 경쟁률을 바로 확인할 수 있어요."
        />
      </div>

      <div className={clsx("mt-6 grid w-full gap-3", isDesktop ? "grid-cols-2" : "grid-cols-1")}>
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

export const DesktopDoneStep = () => <DoneStepBase isDesktop />;

export const MobileDoneStep = () => <DoneStepBase isDesktop={false} />;

export default MobileDoneStep;
