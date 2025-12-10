"use client";

import { useRouter } from "next/navigation";

import BlockBtn from "@/components/button/BlockBtn";

import { IconCheck } from "@/public/svgs/mentor";

const CompletionScreen = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <div className="flex flex-col items-center">
        {/* 체크 아이콘 */}
        <div className="mb-8">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary-100">
            <IconCheck className="h-16 w-16 text-primary" />
          </div>
        </div>

        {/* 타이틀 */}
        <h1 className="mb-4 text-center typo-bold-1 text-primary">증명서 첨부 완료</h1>

        {/* 설명 */}
        <p className="mb-12 text-center typo-regular-2 text-k-600">
          승인은 최대 7일이 소요되며
          <br />
          마이페이지에서 확인할 수 있습니다.
        </p>

        {/* 버튼들 */}
        <div className="w-full max-w-sm space-y-3">
          <BlockBtn
            onClick={() => router.push("/")}
            className="hover:bg-primary-50 border border-primary bg-white text-primary"
          >
            홈으로 이동하기
          </BlockBtn>
          <BlockBtn onClick={() => router.push("/mentor/modify")} className="bg-primary text-white">
            멘토 프로필 작성하기
          </BlockBtn>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;
