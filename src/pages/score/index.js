import { useState, useEffect } from "react";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import Tab from "@/components/ui/tab";
import ScoreSheets from "@/components/score/score-sheets";
import ButtonTab from "@/components/ui/button-tab";
import ScoreSearchBar from "@/components/score/score-search-bar";
import ScoreSearchField from "@/components/score/score-search-field";

export default function ScorePage() {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [tempText, setTempText] = useState("하와이 대학교");

  function handleSearchBar(event) {
    event.preventDefault();

    // 임시
    console.log(searchText);
    setTempText(searchText);

    setSearchActive(false);
  }
  function handleSearchField(keyWord) {
    setSearchText(keyWord);

    // 임시
    console.log(keyWord);
    setTempText(keyWord);

    setSearchActive(false);
  }

  function handleSearchClick() {
    setSearchActive(true);
  }
  const keyWords = ["하와이", "보라스", "릴카톨릭", "파리8", "낭트", "헐", "함부르크", "오스트라바"];

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
        <ScoreSearchBar text={searchText} setText={setSearchText} handleSearch={handleSearchBar} />
        <ScoreSearchField setText={setSearchText} keyWords={keyWords} handleSearch={handleSearchField} />
      </>
    );
  }

  return (
    <>
      <TopDetailNavigation title="점수 공유 현황" />
      <ScoreSearchBar onClick={handleSearchClick} text={searchText} setText={setSearchText} handleSearch={handleSearchBar} />
      <Tab choices={tabChoice} choice={preference} setChoice={setPreference} />
      <ButtonTab choices={filterChoice} choice={filter} setChoice={setFilter} />
      <ScoreSheets sheets={scoreSheets} />
    </>
  );
}
