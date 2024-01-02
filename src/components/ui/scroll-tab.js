import styles from "./scroll-tab.module.css";

export default function ScrollTab(props) {
  const { choices, choice, setChoice } = props;

  function renderTabButtons() {
    return Object.entries(choices).map(([key, value]) => (
      <div key={key} className={parseInt(choice) === parseInt(key) ? styles.tabButtonActive : styles.tabButton} onClick={() => setChoice(parseInt(key))}>
        <div>{value}</div>
      </div>
    ));
  }

  return <div className={styles.tabContainer}>{renderTabButtons()}</div>;
}
