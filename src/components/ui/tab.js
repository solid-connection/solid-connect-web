import styles from "./tab.module.css";

export default function Tab(props) {
  const { choices, choice, setChoice } = props;

  return (
    <div className={styles.tabContainer}>
      {choices.map((c) => (
        <div key={c} className={choice === c ? styles.tabButtonActive : styles.tabButton} onClick={() => setChoice(c)}>
          <div>{c}</div>
        </div>
      ))}
    </div>
  );
}
