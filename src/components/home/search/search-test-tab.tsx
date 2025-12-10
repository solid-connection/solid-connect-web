// DEPRECATED

// type SearchTestTabProps = {
//   tests: string[];
//   test: string | null;
//   setTest: (test: string | null) => void;
// };

// export default function SearchTestTab({ tests, test, setTest }: SearchTestTabProps) {
//   const handleTabClick = (clickedTest) => {
//     // 이미 선택된 탭을 다시 클릭할 경우 선택 취소
//     if (clickedTest === test) {
//       setTest(null);
//     } else {
//       setTest(clickedTest);
//     }
//   };

//   return (
//     <div className={styles.tabContainer} style={{ marginTop: "8px" }}>
//       {tests.map((t) => {
//         const isActive = t === test;
//         return (
//           <button
//             key={t}
//             className={styles.tab}
//             style={{ backgroundColor: isActive ? "#C4DDFF" : "#E7E7E7" }}
//             onClick={() => handleTabClick(t)}
//             type="button"
//           >
//             {t}
//           </button>
//         );
//       })}
//     </div>
//   );
// }
