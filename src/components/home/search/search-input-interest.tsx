// DEPRECATED
// import React, { useRef, useState } from "react";

// import { COUNTRIES_KO } from "@/constants/university";

// type SearchInputInterestProps = {
//   id: string;
//   value: string;
//   setValue: (value: string) => void;
// };

// export default function SearchInputInterest({ id, value, setValue }: SearchInputInterestProps) {
//   const [suggestions, setSuggestions] = useState([]);
//   const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
//   const suggestionsRef = useRef(null);

//   const handleInputChange = (event) => {
//     const { value } = event.target;
//     setValue(value);
//     const filteredSuggestions = COUNTRIES_KO.filter((country) =>
//       country.toLowerCase().includes(value.toLowerCase()),
//     ).slice(0, 5);
//     setSuggestions(filteredSuggestions);
//     setActiveSuggestionIndex(0); // 사용자가 타이핑을 시작하면 활성 추천 인덱스를 재설정합니다.
//   };

//   const handleSuggestionClick = (suggestion) => {
//     setValue(suggestion);
//     setSuggestions([]);
//     setActiveSuggestionIndex(0);
//   };

//   const handleFocus = () => {
//     setSuggestions(
//       value ? COUNTRIES_KO.filter((country) => country.toLowerCase().includes(value.toLowerCase())).slice(0, 5) : [],
//     );
//     setActiveSuggestionIndex(0);
//   };

//   const handleBlur = (event) => {
//     if (suggestionsRef.current && !suggestionsRef.current.contains(event.relatedTarget)) {
//       setSuggestions([]);
//     }
//   };

//   const handleSuggestionMouseDown = (event) => {
//     event.preventDefault();
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === "ArrowDown") {
//       if (activeSuggestionIndex < suggestions.length - 1) {
//         setActiveSuggestionIndex(activeSuggestionIndex + 1);
//       }
//     } else if (event.key === "ArrowUp") {
//       if (activeSuggestionIndex > 0) {
//         setActiveSuggestionIndex(activeSuggestionIndex - 1);
//       }
//     } else if (event.key === "Enter") {
//       event.preventDefault();
//       setValue(suggestions[activeSuggestionIndex]);
//       setSuggestions([]);
//     }
//   };

//   return (
//     <div className={styles.box}>
//       <input
//         className={styles.input}
//         placeholder={`관심${id}`}
//         maxLength={50}
//         value={value}
//         onChange={handleInputChange}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         onKeyDown={handleKeyDown} // 키보드 이벤트 핸들러 추가
//       />
//       {suggestions.length > 0 && (
//         <div className={styles.suggestions} ref={suggestionsRef} onMouseDown={handleSuggestionMouseDown}>
//           {suggestions.map((suggestion, index) => (
//             <div
//               key={index}
//               className={`${styles.suggestion} ${index === activeSuggestionIndex ? styles.active : ""}`} // 선택된 항목에 대한 시각적 피드백 추가
//               onClick={() => handleSuggestionClick(suggestion)}
//             >
//               {suggestion}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
