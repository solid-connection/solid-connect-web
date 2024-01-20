import React, { useState, useRef } from "react";
import styles from "./search-input-interest.module.css";
import ExpendMoreFilled from "@/components/ui/icon/ExpendMoreFilled";

export default function SearchInputInterest(props) {
  const { id, value, setValue } = props;
  const [suggestions, setSuggestions] = useState([]);
  const suggestionsRef = useRef(null);

  const countries = [
    "미국",
    "브라질",
    "캐나다",
    "호주",
    "네덜란드",
    "노르웨이",
    "덴마크",
    "독일",
    "스웨덴",
    "스위스",
    "스페인",
    "영국",
    "오스트리아",
    "이탈리아",
    "체코",
    "포르투갈",
    "프랑스",
    "핀란드",
    "브루나이",
    "싱가포르",
    "아제르바이잔",
    "인도네시아",
    "일본",
    "튀르키예",
    "홍콩",
    "대만",
    "중국",
  ];

  const handleInputChange = (event) => {
    const value = event.target.value;
    setValue(value);
    const filteredSuggestions = countries.filter((country) => country.toLowerCase().includes(value.toLowerCase())).slice(0, 5);
    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (suggestion) => {
    setValue(suggestion);
    setSuggestions([]);
  };

  const handleFocus = () => {
    setSuggestions(value ? countries.filter((country) => country.toLowerCase().includes(value.toLowerCase())).slice(0, 5) : []); // 필터링된 결과에서 최대 5개까지만 가져옵니다.
  };

  const handleBlur = (event) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(event.relatedTarget)) {
      setSuggestions([]);
    }
  };

  const handleSuggestionMouseDown = (event) => {
    event.preventDefault(); // 기본 이벤트를 방지하여 onBlur가 먼저 발생하지 않도록 함
  };

  return (
    <div className={styles.box}>
      <input className={styles.input} placeholder={`관심${id}`} maxLength="50" value={value} onChange={handleInputChange} onFocus={handleFocus} onBlur={handleBlur} />
      <div className={styles.icon}>
        <ExpendMoreFilled />
      </div>
      {suggestions.length > 0 && (
        <div className={styles.suggestions} ref={suggestionsRef} onMouseDown={handleSuggestionMouseDown}>
          {suggestions.map((suggestion, index) => (
            <div key={index} className={styles.suggestion} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
