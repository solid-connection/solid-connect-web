import { Dispatch, SetStateAction } from "react";

import clsx from "clsx";

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
  const defaultColor = {
    activeBtn: "bg-secondary",
    deactiveBtn: "bg-white",
    activeBtnFont: "text-white",
    deactiveBtnFont: "text-black",
    background: "bg-background-1",
  };

  const resultColor = { ...defaultColor, ...color };

  const handleButtonClick = (c: string) => {
    // 이미 선택된 버튼을 다시 클릭할 경우 선택 취소
    if (c === choice) {
      setChoice(null);
    } else {
      setChoice(c);
    }
  };

  return (
    <div
      className={clsx("flex flex-row gap-2 overflow-x-auto whitespace-nowrap", resultColor.background)}
      style={{ ...style }}
    >
      {choices.map((c) => {
        const isActive = c === choice;
        return (
          <button
            key={c}
            className={clsx(
              "rounded-full px-3 py-1 leading-5 transition-all duration-200 ease-in-out",
              isActive ? `${resultColor.activeBtn}` : `${resultColor.deactiveBtn}`,
            )}
            onClick={() => handleButtonClick(c)}
            type="button"
          >
            <span
              className={clsx(
                "font-serif text-sm font-medium",
                isActive ? `${resultColor.activeBtnFont}` : `${resultColor.deactiveBtnFont}`,
              )}
            >
              {c}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ButtonTab;
