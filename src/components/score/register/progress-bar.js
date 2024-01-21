import styles from "./progress-bar.module.css";

export default function ProgressBar(props) {
  const { progress, description } = props;

  return (
    <div style={props.style}>
      <div className={styles.progress}>
        <div className={styles.barContainer}>
          <div className={styles.bar} style={{ width: `${progress}%` }}></div>
        </div>
        <div className={styles.percentage}>{progress}%</div>
      </div>
      <div className={styles.descriptionWrapper}>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
}
