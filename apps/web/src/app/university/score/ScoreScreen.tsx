"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetMyGpaScore, useGetMyLanguageTestScore } from "@/apis/Scores";
import { getSchoolEmailVerificationPath } from "@/app/my/school-email/_lib/returnTo";
import BlockBtn from "@/components/button/BlockBtn";
import Tab from "@/components/ui/Tab";
import { showIconToast } from "@/lib/toast/showIconToast";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { IconSolidConnectionSmallLogo } from "@/public/svgs/my";
import { formatLanguageTestScore, languageTestMapping, ScoreSubmitStatus } from "@/types/score";
import ScoreCard from "./ScoreCard";

const SCORE_TAB_CHOICES = ["공인어학", "학점"] as const;
type ScoreTab = (typeof SCORE_TAB_CHOICES)[number];

const ScoreScreen = () => {
  const router = useRouter();
  const homeUniversityId = useAuthStore((state) => state.homeUniversityId);
  const isAuthInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [curTab, setCurTab] = useState<ScoreTab>("공인어학");
  const shouldFetchGpaScore = isAuthInitialized && isAuthenticated && homeUniversityId !== null;
  // TODO: 서버의 모학교 미인증 에러 코드가 확정되면 GPA 조회 실패 시 학교 인증으로 보내는 fallback을 추가한다.
  const { data: gpaScoreData } = useGetMyGpaScore({ enabled: shouldFetchGpaScore });
  const { data: languageTestScoreList = [] } = useGetMyLanguageTestScore();
  const gpaScoreList = gpaScoreData?.gpaScoreStatusResponseList ?? [];
  const isEmptyCurrentTab = curTab === "공인어학" ? languageTestScoreList.length === 0 : gpaScoreList.length === 0;

  useEffect(() => {
    if (!isAuthInitialized || !isAuthenticated || homeUniversityId !== null) {
      return;
    }

    router.replace(getSchoolEmailVerificationPath("score"));
  }, [homeUniversityId, isAuthInitialized, isAuthenticated, router]);

  const handleScoreClick = (status: ScoreSubmitStatus, rejectedReason?: string | null) => {
    if (status === ScoreSubmitStatus.REJECTED) {
      showIconToast("logo", rejectedReason ?? "승인이 거절되었습니다.");
      return;
    }
    if (status === ScoreSubmitStatus.PENDING) {
      showIconToast("cap", "심사중인 성적은 사용할 수 없습니다");
    }
  };

  if (isAuthInitialized && isAuthenticated && homeUniversityId === null) {
    return null;
  }

  return (
    <div className="h-full">
      <div className="mx-5 mb-40">
        <Tab<ScoreTab> choices={SCORE_TAB_CHOICES} choice={curTab} setChoice={setCurTab} />
        {isEmptyCurrentTab ? (
          <div className="mt-24 flex flex-col items-center rounded-lg bg-white px-6 py-8 text-center shadow-sdwB">
            <IconSolidConnectionSmallLogo />
            <p className="mt-3 text-k-500 typo-regular-2">
              아직 등록된 성적이 없어요.
              <br />
              아래 버튼을 눌러 성적을 입력해 주세요.
            </p>
          </div>
        ) : (
          <div className="mt-3.5 flex flex-col gap-3.5">
            {curTab === "공인어학" &&
              languageTestScoreList.map((score) => (
                <button
                  key={score.id}
                  type="button"
                  className="text-left"
                  onClick={() => handleScoreClick(score.verifyStatus, score.rejectedReason)}
                >
                  <ScoreCard
                    name={languageTestMapping[score.languageTestResponse.languageTestType]}
                    score={formatLanguageTestScore(
                      score.languageTestResponse.languageTestType,
                      score.languageTestResponse.languageTestScore,
                    )}
                    status={score.verifyStatus}
                    // date={new Date(score.issueDate).toISOString()}
                    date="2026-01-01"
                    isFocused={score.verifyStatus === "APPROVED"}
                  />
                </button>
              ))}

            {curTab === "학점" &&
              gpaScoreData &&
              gpaScoreList.map((score) => (
                <button
                  key={score.id}
                  type="button"
                  className="text-left"
                  onClick={() => handleScoreClick(score.verifyStatus, score.rejectedReason)}
                >
                  <ScoreCard
                    name={gpaScoreData.homeUniversityName}
                    score={`${score.gpaResponse.gpa.toFixed(2)}/${score.gpaResponse.gpaCriteria}`}
                    status={score.verifyStatus}
                    // date={new Date(score.issueDate).toISOString()}
                    date="2026-01-01"
                    isFocused={score.verifyStatus === "APPROVED"}
                  />
                </button>
              ))}
          </div>
        )}
      </div>
      <div className="fixed bottom-14 w-full max-w-app bg-white">
        <div className="mb-[37px] px-5">
          {curTab === "공인어학" ? (
            <BlockBtn onClick={() => router.push("/university/score/submit/language-test")}>
              어학 성적 입력하기
            </BlockBtn>
          ) : (
            <BlockBtn onClick={() => router.push("/university/score/submit/gpa")}>학점 입력하기</BlockBtn>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreScreen;
