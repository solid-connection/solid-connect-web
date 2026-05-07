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
        <h1 className="mb-4 text-center text-primary typo-bold-1">멘토 전환 신청 완료</h1>

        {/* 설명 */}
        <p className="mb-12 text-center text-k-600 typo-regular-2">
          관리자 검토가 완료되면
          <br />
          멘토 회원으로 전환돼요.
        </p>

        {/* 버튼들 */}
        <div className="w-full max-w-sm space-y-3">
          <BlockBtn
            onClick={() => router.push("/my")}
            className="hover:bg-primary-50 border border-primary bg-white text-primary"
          >
            마이페이지로 이동하기
          </BlockBtn>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;
