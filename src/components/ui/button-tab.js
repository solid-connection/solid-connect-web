import styles from "./button-tab.module.css";

export default function ButtonTab(props) {
  // 선택지
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

  function renderTabButtons() {
    return Object.entries(choices).map(([key, value]) => {
      const isActive = parseInt(choice) === parseInt(key);
      return (
        <div
          key={key}
          style={{
            backgroundColor: isActive ? color.activeBtn : color.deactiveBtn,
            color: isActive ? color.activeBtnFont : color.deactiveBtnFont,
          }}
          className={styles.tabButton}
          onClick={() => setChoice(parseInt(key))}
        >
          <div>{value}</div>
        </div>
      );
    });
  }

  return (
    <div className={styles.tabContainer} style={{ ...style, backgroundColor: color.background }}>
      {renderTabButtons()}
    </div>
  );
}
