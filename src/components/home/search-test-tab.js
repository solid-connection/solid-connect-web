import styles from "./search-test-tab.module.css";

export default function SearchTestTab(props) {
  const { tests } = props;
  return (
    <div className={styles.tabContainer}>
      {tests.map((test, index) => {
        return (
          <div key={index} className={styles.tab}>
            {test}
          </div>
        );
      })}
    </div>
  );
}
