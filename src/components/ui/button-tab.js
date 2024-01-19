import styles from "./button-tab.module.css";

export default function ButtonTab(props) {
  const { choices, choice, setChoice, style } = props;
  // 디자인 색상
  const defaultColor = {
    activeBtn: "#6f90d1",
    deactiveBtn: "white",
    activeBtnFont: "white",
    deactiveBtnFont: "black",
    background: "white",
  };
  const color = { ...defaultColor, ...props.color };

  const handleButtonClick = (c) => {
    // 이미 선택된 버튼을 다시 클릭할 경우 선택 취소
    if (c === choice) {
      setChoice(null);
    } else {
      setChoice(c);
    }
  };

  return (
    <div className={styles.tabContainer} style={{ ...style, backgroundColor: color.background }}>
      {choices.map((c) => {
        const isActive = c === choice;
        return (
          <div
            key={c}
            style={{
              backgroundColor: isActive ? color.activeBtn : color.deactiveBtn,
              color: isActive ? color.activeBtnFont : color.deactiveBtnFont,
            }}
            className={styles.tabButton}
            onClick={() => handleButtonClick(c)}
          >
            <div>{c}</div>
          </div>
        );
      })}
    </div>
  );
}
