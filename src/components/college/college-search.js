import React, { useState } from "react";
import classes from "./college-search.module.css";

function CollegeSearch() {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [query, setQuery] = useState("");

  return (
    <div className={classes.search}>
      <select className={classes.dropdown} value={country} onChange={(e) => setCountry(e.target.value)}>
        <option value="">국가</option>
      </select>
      <select className={classes.dropdown} value={region} onChange={(e) => setRegion(e.target.value)}>
        <option value="">지역</option>
      </select>

      <input type="text" placeholder="학교를 검색하세요." value={query} onChange={(e) => setQuery(e.target.value)} className={classes.searchInput} />
    </div>
  );
}

export default CollegeSearch;
