import { Dispatch, SetStateAction } from "react";

import styles from "./button-tab.module.css";

type ButtonTabProps = {
  choices: string[];
  choice: string | null;
  setChoice: Dispatch<SetStateAction<string | null>>;
  style?: React.CSSProperties;
  color?: {
    activeBtn?: string;
    deactiveBtn?: string;
    activeBtnFont?: string;
    deactiveBtnFont?: string;
    background?: string;
  };
};

const ButtonTab = ({ choices, choice, setChoice, style, color }: ButtonTabProps) => {
  // 디자인 색상
  const defaultColor = {
    activeBtn: "#6f90d1",
    deactiveBtn: "#ffffff",
    activeBtnFont: "#ffffff",
    deactiveBtnFont: "black",
    background: "#ffffff",
  };
  const resultColor = { ...defaultColor, ...color };

  const handleButtonClick = (c) => {
    // 이미 선택된 버튼을 다시 클릭할 경우 선택 취소
    if (c === choice) {
      setChoice(null);
    } else {
      setChoice(c);
    }
  };

  return (
    <div className={styles["tab-container"]} style={{ ...style, backgroundColor: resultColor.background }}>
      {choices.map((c) => {
        const isActive = c === choice;
        return (
          <button
            key={c}
            style={{
              backgroundColor: isActive ? resultColor.activeBtn : resultColor.deactiveBtn,
              color: isActive ? resultColor.activeBtnFont : resultColor.deactiveBtnFont,
            }}
            className={styles["tab-button"]}
            onClick={() => handleButtonClick(c)}
            type="button"
          >
            <div>{c}</div>
          </button>
        );
      })}
    </div>
  );
};

export default ButtonTab;
