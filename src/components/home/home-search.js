import { useState, useEffect } from "react";

import styles from "./home-search.module.css";
import ButtonTab from "../ui/button-tab";
import SearchTestTab from "./search-test-tab";

export default function HomeSearch(props) {
  const [region, setRegion] = useState("");
  const regions = ["유럽권", "미주권", "아시아권", "중국권"];

  const [test, setTest] = useState("");
  const [tests, setTests] = useState(["tt", "oo"]); // ["TOEIC", "TOEFL IBT", "TOEFL ITP", "IELTS"]

  useEffect(() => {
    console.log(region);
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
    // switch (region) {
    //   case 1:
    //     setTests(["TOEIC", "TOEFL IBT", "TOEFL ITP", "IELTS"]);
    //     break;
    //   case 2:
    //     setTests(["TOEIC", "TOEFL IBT", "TOEFL ITP", "IELTS"]);

    //     break;
    //   case 3:
    //     setTests(["TOEIC", "TOEFL IBT", "TOEFL ITP", "IELTS"]);

    //     break;

    //   default:
    //     setTests([]);
    // }
  }, [region]);

  return (
    <div style={{ marginRight: "20px" }}>
      <ButtonTab choices={regions} choice={region} setChoice={setRegion} color={{ deactiveBtn: "#f0f0f0", deactiveBtnFont: "#A2A2A2" }} style={{ marginTop: "14px" }} />
      {region !== "" && <SearchTestTab tests={tests} />}

      <div className={styles.searchContainer}>
        <div>선택 성적</div>
        <div>관심있는 나라</div>
        <div>관심1</div>
        <div>관심1</div>
        <div>관심1</div>
        <button className={styles.searchButton}>학교 검색</button>
      </div>
    </div>
  );
}
