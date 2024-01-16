import styles from "./scroll-tab.module.css";

export default function ScrollTab(props) {
  const { style, choices, choice, setChoice } = props;

  return (
    <div style={style} className={styles.tabContainer}>
      {choices.map((c) => (
        <div key={c} className={choice === c ? styles.tabButtonActive : styles.tabButton} onClick={() => setChoice(c)}>
          <div>{c}</div>
        </div>
      ))}
    </div>
  );
}
