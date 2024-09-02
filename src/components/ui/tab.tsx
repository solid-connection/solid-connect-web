import styles from "./tab.module.css";

type TabProps = {
  choices: string[];
  choice: string;
  setChoice: React.Dispatch<React.SetStateAction<string>>;
  color?: {
    activeBtn?: string;
    deactiveBtn?: string;
    activeBtnFont?: string;
    deactiveBtnFont?: string;
  };
};

export default function Tab({ choices, choice, setChoice, color }: TabProps) {
  const defaultColor = {
    activeBtnFont: "#000",
    deactiveBtnFont: "#7D7D7D",
  };
  const combinedColor = { ...defaultColor, ...color };
  return (
    <div className={styles.tabContainer}>
      {choices.map((c) => (
        <div
          key={c}
          style={{
            color: choice === c ? combinedColor.activeBtnFont : combinedColor.deactiveBtnFont,
          }}
          className={choice === c ? styles.tabButtonActive : styles.tabButton}
          onClick={() => setChoice(c)}
        >
          <div>{c}</div>
        </div>
      ))}
    </div>
  );
}
