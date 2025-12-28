"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import BlockBtn from "@/components/button/BlockBtn";
import Tab from "@/components/ui/Tab";

import ScoreCard from "./ScoreCard";

import { languageTestMapping } from "@/types/score";

import useGetMyGpaScore from "@/api/score/client/useGetMyGpaScore";
import useGetMyLanguageTestScore from "@/api/score/client/useGetMyLanguageTestScore";

const ScoreScreen = () => {
  const router = useRouter();
  const [curTab, setCurTab] = useState<"공인어학" | "학점">("공인어학");
  const { data: gpaScoreList = [] } = useGetMyGpaScore();
  const { data: languageTestScoreList = [] } = useGetMyLanguageTestScore();

  return (
    <div className="h-full">
      <div className="mx-5 mb-40">
        <Tab choices={["공인어학", "학점"]} choice={curTab} setChoice={setCurTab} />
        <div className="mt-3.5 flex flex-col gap-3.5">
          {curTab === "공인어학" &&
            languageTestScoreList.map((score) => (
              <ScoreCard
                key={score.id}
                name={languageTestMapping[score.languageTestResponse.languageTestType]}
                score={score.languageTestResponse.languageTestScore}
                status={score.verifyStatus}
                // date={new Date(score.issueDate).toISOString()}
                date="2026-01-01"
                isFocused={score.verifyStatus === "APPROVED"}
                rejectedReason={score.rejectedReason}
              />
            ))}

          {curTab === "학점" &&
            gpaScoreList.map((score) => (
              <ScoreCard
                key={score.id}
                name="인하대학교" // TODO: 학교명 API에서 받아오기
                score={`${score.gpaResponse.gpa.toFixed(2)}/${score.gpaResponse.gpaCriteria}`}
                status={score.verifyStatus}
                // date={new Date(score.issueDate).toISOString()}
                date="2026-01-01"
                isFocused={score.verifyStatus === "APPROVED"}
                rejectedReason={score.rejectedReason}
              />
            ))}
        </div>
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
