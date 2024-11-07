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

const Tab = ({ choices, choice, setChoice, color }: TabProps) => {
  const defaultColor = {
    activeBtnFont: "#000",
    deactiveBtnFont: "#7D7D7D",
  };
  const combinedColor = { ...defaultColor, ...color };
  return (
    <div className={styles.tabContainer}>
      {choices.map((c) => (
        <button
          key={c}
          style={{
            color: choice === c ? combinedColor.activeBtnFont : combinedColor.deactiveBtnFont,
          }}
          className={choice === c ? styles.tabButtonActive : styles.tabButton}
          onClick={() => setChoice(c)}
          type="button"
        >
          <div>{c}</div>
        </button>
      ))}
    </div>
  );
};

export default Tab;
