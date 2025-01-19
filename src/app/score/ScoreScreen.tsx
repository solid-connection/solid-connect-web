"use client";

import { useEffect, useState } from "react";

import { getMyGpaScoreApi, getMyLanguageTestScoreApi } from "@/services/score";

import Tab from "@/components/ui/Tab";

import ScoreCard from "./ScoreCard";

import { GpaScore, LanguageTestScore } from "@/types/score";

const ScoreScreen = () => {
  const [curTab, setCurTab] = useState<"공인어학" | "학점">("공인어학");
  const [gpaScoreList, setGpaScoreList] = useState<GpaScore[]>([]);
  const [languageTestScoreList, setLanguageTestScoreList] = useState<LanguageTestScore[]>([]);

  useEffect(() => {
    const fetchGpaScoreList = async () => {
      try {
        const res = await getMyGpaScoreApi();
        setGpaScoreList(res.data.gpaScoreStatusList);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchLanguageTestScoreList = async () => {
      try {
        const res = await getMyLanguageTestScoreApi();
        setLanguageTestScoreList(res.data.languageTestScoreStatusList);
      } catch (err) {
        console.error(err);
      }
    };
    if (curTab === "공인어학") fetchLanguageTestScoreList();
    else fetchGpaScoreList();
  }, [curTab]);

  return (
    <div>
      <div className="mx-5">
        <Tab choices={["공인어학", "학점"]} choice={curTab} setChoice={setCurTab} />
        <div className="mt-3.5 flex flex-col gap-3.5">
          {curTab === "공인어학" &&
            languageTestScoreList.map((score) => (
              <ScoreCard
                key={score.id}
                name={score.languageTest.languageTestType}
                score={score.languageTest.languageTestScore}
                status={score.verifyStatus}
                date={new Date(score.issueDate).toISOString()}
              />
            ))}

          {curTab === "학점" &&
            gpaScoreList.map((score) => (
              <ScoreCard
                key={score.id}
                name="학점"
                score={`${score.gpa.gpa.toFixed(1)}/${score.gpa.gpaCriteria}`}
                status={score.verifyStatus}
                date={score.issueDate}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreScreen;
