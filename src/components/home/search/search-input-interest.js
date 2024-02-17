import React, { useState, useRef } from "react";
import styles from "./search-input-interest.module.css";
import ExpendMoreFilled from "@/components/ui/icon/ExpendMoreFilled";

export default function SearchInputInterest(props) {
  const { id, value, setValue } = props;
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
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
    setActiveSuggestionIndex(0); // 사용자가 타이핑을 시작하면 활성 추천 인덱스를 재설정합니다.
  };

  const handleSuggestionClick = (suggestion) => {
    setValue(suggestion);
    setSuggestions([]);
    setActiveSuggestionIndex(0);
  };

  const handleFocus = () => {
    setSuggestions(value ? countries.filter((country) => country.toLowerCase().includes(value.toLowerCase())).slice(0, 5) : []);
    setActiveSuggestionIndex(0);
  };

  const handleBlur = (event) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(event.relatedTarget)) {
      setSuggestions([]);
    }
  };

  const handleSuggestionMouseDown = (event) => {
    event.preventDefault();
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      if (activeSuggestionIndex < suggestions.length - 1) {
        setActiveSuggestionIndex(activeSuggestionIndex + 1);
      }
    } else if (event.key === "ArrowUp") {
      if (activeSuggestionIndex > 0) {
        setActiveSuggestionIndex(activeSuggestionIndex - 1);
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      setValue(suggestions[activeSuggestionIndex]);
      setSuggestions([]);
    }
  };

  return (
    <div className={styles.box}>
      <input
        className={styles.input}
        placeholder={`관심${id}`}
        maxLength="50"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown} // 키보드 이벤트 핸들러 추가
      />
      {suggestions.length > 0 && (
        <div className={styles.suggestions} ref={suggestionsRef} onMouseDown={handleSuggestionMouseDown}>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`${styles.suggestion} ${index === activeSuggestionIndex ? styles.active : ""}`} // 선택된 항목에 대한 시각적 피드백 추가
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
