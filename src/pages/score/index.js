import { useState, useEffect } from "react";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import ScoreSheet from "@/components/score/score-sheet";
import Tab from "@/components/ui/tab";
import ScoreSheets from "@/components/score/score-sheets";
import ButtonTab from "@/components/ui/button-tab";

export default function ScorePage() {
  const [preference, setPreference] = useState(1);
  const tabChoice = {
    1: "1순위",
    2: "2순위",
  };

  const [filter, setFilter] = useState(1);
  const filterChoice = {
    1: "유럽권",
    2: "미주권",
    3: "아시아권",
    4: "학점높은 순",
    5: "어학성적 높은 순",
  };

  const scoreSheets = [
    {
      college: "하와이 대학교",
      scores: [
        {
          key: 1,
          score: 4.5,
          count: 880,
        },
        {
          key: 2,
          score: 4.3,
          count: 880,
        },
        {
          key: 3,
          score: 4.2,
          count: 880,
        },
      ],
    },
    {
      college: "하와이 대학교",
      scores: [
        {
          key: 1,
          score: 4.5,
          count: 880,
        },
        {
          key: 2,
          score: 4.3,
          count: 880,
        },
        {
          key: 3,
          score: 4.2,
          count: 880,
        },
      ],
    },
    {
      college: "하와이 대학교",
      scores: [
        {
          key: 1,
          score: 4.5,
          count: 880,
        },
        {
          key: 2,
          score: 4.3,
          count: 880,
        },
        {
          key: 3,
          score: 4.2,
          count: 880,
        },
      ],
    },
  ];

  useEffect(() => {}, [preference]);
  return (
    <>
      <TopDetailNavigation title="점수 공유 현황" />
      <div>검색 바</div>
      <Tab choices={tabChoice} choice={preference} setChoice={setPreference} />
      <ButtonTab choices={filterChoice} choice={filter} setChoice={setFilter} />
      {preference}
      <ScoreSheets sheets={scoreSheets} />
    </>
  );
}
