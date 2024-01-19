import { useState, useEffect } from "react";

import styles from "./home-search.module.css";
import ButtonTab from "../../ui/button-tab";
import SearchTestTab from "./search-test-tab";
import SearchInputTest from "./search-input-test";
import SearchInputCountry from "./search-input-country";
import SearchInputInterest from "./search-input-interest";

export default function HomeSearch(props) {
  const [region, setRegion] = useState("");
  const regions = ["유럽권", "미주권", "아시아권", "중국권"];

  const [test, setTest] = useState("");
  const [tests, setTests] = useState([]); // ["TOEIC", "TOEFL IBT", "TOEFL ITP", "IELTS"]

  useEffect(() => {
    if (region === "유럽권") {
      setTests(["TOEIC", "TOEFL IBT", "TOEFL ITP", "IELTS"]);
    } else if (region === "미주권") {
      setTests(["TOEIC", "TOEFL IBT", "TOEFL ITP", "IELTS"]);
    } else if (region === "아시아권") {
      setTests(["TOEIC", "TOEFL IBT", "TOEFL ITP", "JLPT"]);
    } else if (region === "중국권") {
      setTests(["TOEIC", "TOEFL IBT", "TOEFL ITP", "IELTS"]);
    } else {
      setTests([]);
    }
    // 선택된 지역이 변경되었을 때 선택된 시험이 목록에 없으면 선택 취소
    if (test !== "" && !tests.includes(test)) {
      setTest("");
    }
  }, [region]);

  return (
    <div style={{ marginRight: "20px" }}>
      <ButtonTab choices={regions} choice={region} setChoice={setRegion} color={{ deactiveBtn: "#f0f0f0", deactiveBtnFont: "#A2A2A2" }} style={{ marginTop: "14px" }} />
      {region !== "" && <SearchTestTab tests={tests} test={test} setTest={setTest} />}
      <div className={styles.searchInputs}>
        <SearchInputTest test={test} />
        <SearchInputCountry />
        <SearchInputInterest />
        <SearchInputInterest />

        <button className={styles.searchButton}>학교 검색</button>
      </div>

      <div className={styles.searchContainer}></div>
    </div>
  );
}
