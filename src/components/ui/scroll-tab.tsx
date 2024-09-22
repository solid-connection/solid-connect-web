import styles from "./scroll-tab.module.css";

type ScrollTabProps = {
  choices: string[];
  choice: string;
  setChoice: React.Dispatch<React.SetStateAction<string>>;
  borderColor?: string;
  style?: React.CSSProperties;
};

export default function ScrollTab({ choices, choice, setChoice, borderColor, style }: ScrollTabProps) {
  return (
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
}
