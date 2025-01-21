import { useRouter } from "next/navigation";

import BlockBtn from "@/components/button/BlockBtn";

const DoneStep = () => {
  const router = useRouter();
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="text-2xl font-bold">지원 완료</div>

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
