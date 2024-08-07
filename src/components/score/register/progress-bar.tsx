import styles from "./progress-bar.module.css";

interface ProgressBarProps {
  progress: number;
  display?: string;
  description?: string;
  style?: React.CSSProperties;
}

export default function ProgressBar({ progress, display, description, style }: ProgressBarProps) {
  return (
    <div style={style}>
      <div className={styles.progress}>
        <div className={styles.barContainer}>
          <div className={styles.bar} style={{ width: `${progress}%` }}></div>
        </div>
        <div className={styles.percentage}>{display || `${progress}%`}</div>
      </div>
      <div className={styles.descriptionWrapper}>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
}
