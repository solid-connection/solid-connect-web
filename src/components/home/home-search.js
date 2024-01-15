import { useState } from "react";

import styles from "./home-search.module.css";
import ButtonTab from "../ui/button-tab";

export default function HomeSearch(props) {
  const [filter, setFilter] = useState("");
  const filters = ["유럽권", "미주권", "아시아권"];
  return (
    <div style={{ marginRight: "20px" }}>
      <ButtonTab choices={filters} choice={filter} setChoice={setFilter} color={{ deactiveBtn: "#D9D9D9" }} style={{ marginTop: "14px" }} />

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
