import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { LANGUAGE_TEST_INVERSE } from "@/types/application";
import styles from "./home-search.module.css";
import ButtonTab from "../../ui/button-tab";
import SearchTestTab from "./search-test-tab";
import SearchInputTest from "./search-input-test";
import SearchInputInterest from "./search-input-interest";
import World from "@/components/layout/icon/World";

export default function HomeSearch(props) {
  const router = useRouter();
  const [region, setRegion] = useState<string>("");
  const regions: string[] = ["유럽권", "미주권", "아시아권", "중국권"];

  const [test, setTest] = useState<string>(""); // 선택된 시험
  const [testList, setTestList] = useState([]); // 지역에 따라 선택 가능한 시험 목록
  const [testScore, setTestScore] = useState("");

  const [country1, setCountry1] = useState<string>("");
  const [country2, setCountry2] = useState<string>("");
  const [country3, setCountry3] = useState<string>("");

  useEffect(() => {
    if (region === "유럽권") {
      setTestList(["TOEIC", "TOEFL IBT", "TOEFL ITP", "IELTS"]);
    } else if (region === "미주권") {
      setTestList(["TOEIC", "TOEFL IBT", "TOEFL ITP", "IELTS"]);
    } else if (region === "아시아권") {
      setTestList(["TOEIC", "TOEFL IBT", "TOEFL ITP", "JLPT"]);
    } else if (region === "중국권") {
      setTestList(["TOEIC", "TOEFL IBT", "TOEFL ITP", "IELTS"]);
    } else {
      setTestList([]);
    }
    // 선택된 지역이 변경되었을 때 선택된 시험이 목록에 없으면 선택 취소
    if (test !== "" && !testList.includes(test)) {
      setTest("");
    }
  }, [region]);

  useEffect(() => {
    // 첫번째 학교 지우면 두번째, 세번째 학교도 지워짐
    if (country1 === "") {
      setCountry2("");
      setCountry3("");
    }
    if (country2 === "") {
      setCountry3("");
    }
  }, [country1, country2]);

  function handleSearch() {
    router.push({
      pathname: "/college",
      query: {
        region: region,
        test: LANGUAGE_TEST_INVERSE[test],
        testScore: testScore,
        keyword: [country1, country2, country3].filter((country) => country !== ""),
      },
    });
  }

  return (
    <div style={{ marginRight: "20px" }}>
      <ButtonTab choices={regions} choice={region} setChoice={setRegion} color={{ deactiveBtn: "#f0f0f0", deactiveBtnFont: "#A2A2A2" }} style={{ marginTop: "14px" }} />
      {region !== "" && <SearchTestTab tests={testList} test={test} setTest={setTest} />}
      {test && (
        <div className={styles.searchInputs}>
          <SearchInputTest test={test} score={testScore} setScore={setTestScore} />
          <div className={styles.box}>
            <div className={styles.icon}>
              <World />
            </div>
            <div className={styles.main}>관심있는 나라</div>
          </div>
          <SearchInputInterest id={1} value={country1} setValue={setCountry1} />
          {country1 && <SearchInputInterest id={2} value={country2} setValue={setCountry2} />}
          {country2 && <SearchInputInterest id={3} value={country3} setValue={setCountry3} />}
          <button className={styles.searchButton} onClick={handleSearch}>
            학교 검색
          </button>
        </div>
      )}

      <div className={styles.searchContainer}></div>
    </div>
  );
}
