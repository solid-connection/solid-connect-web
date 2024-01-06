import styles from "./scroll-tab.module.css";

export default function ScrollTab(props) {
  const { style, choices, choice, setChoice } = props;

  return (
    <div style={style} className={styles.tabContainer}>
      {Object.entries(choices).map(([key, value]) => (
        <div key={key} className={parseInt(choice) === parseInt(key) ? styles.tabButtonActive : styles.tabButton} onClick={() => setChoice(parseInt(key))}>
          <div>{value}</div>
        </div>
      ))}
    </div>
  );
}
