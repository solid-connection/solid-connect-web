"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BlockBtn from "@/components/button/BlockBtn";
import Tab from "@/components/ui/Tab";

import ScoreCard from "./ScoreCard";

import { GpaScore, LanguageTestScore, languageTestMapping } from "@/types/score";

import { getMyGpaScoreApi, getMyLanguageTestScoreApi } from "@/apis/score";

const ScoreScreen = () => {
  const router = useRouter();
  const [curTab, setCurTab] = useState<"공인어학" | "학점">("공인어학");
  const [gpaScoreList, setGpaScoreList] = useState<GpaScore[]>([]);
  const [languageTestScoreList, setLanguageTestScoreList] = useState<LanguageTestScore[]>([]);

  useEffect(() => {
    const fetchGpaScoreList = async () => {
      try {
        const res = await getMyGpaScoreApi();
        setGpaScoreList(res.data.gpaScoreStatusResponseList);
      } catch (err) {
        if (err.response) {
          console.error("Axios response error", err.response);
          if (err.response.status === 401 || err.response.status === 403) {
            alert("로그인이 필요합니다");
            document.location.href = "/login";
          } else {
            alert(err.response.data?.message);
          }
        } else {
          console.error("Error", err.message);
          alert(err.message);
        }
      }
    };
    const fetchLanguageTestScoreList = async () => {
      try {
        const res = await getMyLanguageTestScoreApi();
        setLanguageTestScoreList(res.data.languageTestScoreStatusResponseList);
      } catch (err) {
        if (err.response) {
          console.error("Axios response error", err.response);
          if (err.response.status === 401 || err.response.status === 403) {
            alert("로그인이 필요합니다");
            document.location.href = "/login";
          } else {
            alert(err.response.data?.message);
          }
        } else {
          console.error("Error", err.message);
          alert(err.message);
        }
      }
    };
    if (curTab === "공인어학") fetchLanguageTestScoreList();
    else fetchGpaScoreList();
  }, [curTab]);

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
                date="2025-01-01"
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
                date="2025-01-01"
                isFocused={score.verifyStatus === "APPROVED"}
                rejectedReason={score.rejectedReason}
              />
            ))}
        </div>
      </div>
      <div className="fixed bottom-14 w-full max-w-[600px] bg-white">
        <div className="mb-[37px] px-5">
          {curTab === "공인어학" ? (
            <BlockBtn onClick={() => router.push("/score/submit/language-test")}>어학 성적 입력하기</BlockBtn>
          ) : (
            <BlockBtn onClick={() => router.push("/score/submit/gpa")}>학점 입력하기</BlockBtn>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreScreen;
