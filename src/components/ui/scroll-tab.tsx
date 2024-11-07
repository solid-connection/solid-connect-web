import styles from "./scroll-tab.module.css";

type ScrollTabProps = {
  choices: string[];
  choice: string;
  setChoice: React.Dispatch<React.SetStateAction<string>>;
  borderColor?: string;
  style?: React.CSSProperties;
};

const ScrollTab = ({ choices, choice, setChoice, borderColor, style }: ScrollTabProps) => (
  <div style={style} className={styles.tabContainer}>
    {choices.map((c) => (
      <button
        key={c}
        className={styles.tabButton}
        style={choice === c ? { borderColor: borderColor || "var(--primary-1, #6f90d1)" } : {}}
        onClick={() => setChoice(c)}
        type="button"
      >
        <div>{c}</div>
      </button>
    ))}
  </div>
);

export default ScrollTab;
