import Image from "next/image";
import { useRouter } from "next/navigation";

import BlockBtn from "@/components/button/BlockBtn";

const DoneStep = () => {
  const router = useRouter();
  return (
    <div className="mt-52 flex h-full flex-col items-center justify-center gap-6">
      <Image src="/images/survey-complete-icon.png" width={120} height={120} alt="지원 완료" />
      <div className="text-center font-serif text-k-800 typo-sb-2">
        학교 지원이
        <br />
        <span className="text-secondary">완료</span>
        되었어요!
      </div>

      <div className="mt-10 flex w-full flex-col gap-3 px-5 pt-8">
        <BlockBtn
          className="bg-primary-900 text-white"
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
