import styles from "./search-test-tab.module.css";

export default function SearchTestTab(props) {
  const { tests, test, setTest } = props;

  const handleTabClick = (clickedTest) => {
    // 이미 선택된 탭을 다시 클릭할 경우 선택 취소
    if (clickedTest === test) {
      setTest(null);
    } else {
      setTest(clickedTest);
    }
  };

  return (
    <div className={styles.tabContainer} style={{ marginTop: "8px" }}>
      {tests.map((t, index) => {
        const isActive = t === test;
        return (
          <div key={index} className={styles.tab} style={{ backgroundColor: isActive ? "#C4DDFF" : "#E7E7E7" }} onClick={() => handleTabClick(t)}>
            {t}
          </div>
        );
      })}
    </div>
  );
}
