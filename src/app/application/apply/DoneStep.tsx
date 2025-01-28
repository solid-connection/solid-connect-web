import Image from "next/image";
import { useRouter } from "next/navigation";

import BlockBtn from "@/components/button/BlockBtn";

const DoneStep = () => {
  const router = useRouter();
  return (
    <div className="mt-52 flex h-full flex-col items-center">
      <Image src="/images/survey-complete-icon.png" width={120} height={120} alt="지원 완료" />
      <div className="font-serif text-2xl font-semibold text-k-800">지원 완료</div>

      <div className="fixed bottom-14 w-full max-w-[600px] bg-white">
        <div className="mb-[37px] px-5">
          <BlockBtn
            onClick={() => {
              router.push("/");
            }}
          >
            홈으로
          </BlockBtn>
        </div>
      </div>
    </div>
  );
};

export default DoneStep;
