import { useState, useEffect } from "react";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import Tab from "@/components/ui/tab";
import ScoreSheets from "@/components/score/score-sheets";
import ButtonTab from "@/components/ui/button-tab";
import ScoreSearchBar from "@/components/score/score-search-bar";

export default function ScorePage() {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [tempText, setTempText] = useState("하와이 대학교");
  function handleSearch(event) {
    event.preventDefault();
    console.log(searchText);
    setTempText(searchText);
  }

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
      key: 1,
      college: "하와이 대학교",
      scores: [
        {
          key: 1,
          score: 4.5,
          count: preference,
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
      key: 2,
      college: tempText,
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
      key: 3,
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

  if (searchActive) {
    return (
      <>
        <TopDetailNavigation title="점수 공유 현황" />
        <ScoreSearchBar text={searchText} setText={setSearchText} handleSearch={handleSearch} />
      </>
    );
  }

  return (
    <>
      <TopDetailNavigation title="점수 공유 현황" />
      <ScoreSearchBar text={searchText} setText={setSearchText} handleSearch={handleSearch} />
      <Tab choices={tabChoice} choice={preference} setChoice={setPreference} />
      <ButtonTab choices={filterChoice} choice={filter} setChoice={setFilter} />
      <ScoreSheets sheets={scoreSheets} />
    </>
  );
}
