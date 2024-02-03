import styles from "./scroll-tab.module.css";

export default function ScrollTab(props) {
  const { choices, choice, setChoice, borderColor } = props;

  return (
    <div style={props.style} className={styles.tabContainer}>
      {choices.map((c) => (
        <div key={c} className={styles.tabButton} style={choice === c ? { borderColor: borderColor || "var(--primary-1, #6f90d1)" } : {}} onClick={() => setChoice(c)}>
          <div>{c}</div>
        </div>
      ))}
    </div>
  );
}
