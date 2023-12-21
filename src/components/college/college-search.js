import React, { useState, useEffect } from "react";
import classes from "./college-search.module.css";

function CollegeSearch(props) {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [text, setText] = useState("");
  const [regionsOptions, setRegionsOptions] = useState([]);

  const { countries } = props;

  useEffect(() => {
    setRegion("");
    if (countries) {
      const selectedCountry = countries.find((c) => c.name === country);
      if (selectedCountry) {
        setRegionsOptions(selectedCountry.regions);
      } else {
        setRegionsOptions([]);
      }
    }
  }, [country, countries]);

  function submitHandler(event) {
    event.preventDefault();
    props.onSearch(country, region, text);
  }

  return (
    <div className={classes.search}>
      <form onSubmit={submitHandler}>
        <select className={classes.dropdown} value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">국가</option>
          {countries &&
            countries.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
        </select>
        <select className={classes.dropdown} value={region} onChange={(e) => setRegion(e.target.value)} disabled={!country}>
          <option value="">지역</option>
          {regionsOptions.map((r, index) => (
            <option key={index} value={r}>
              {r}
            </option>
          ))}
        </select>
        <input type="text" placeholder="학교를 검색하세요." value={text} onChange={(e) => setText(e.target.value)} className={classes.searchInput} />
      </form>
    </div>
  );
}

export default CollegeSearch;
