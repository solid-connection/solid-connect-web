import ScoreSheet from "./score-sheet";

import styles from "./score-sheets.module.css";

export default function ScoreSheets({ data }: { data: any[] }) {
  return (
    <div className={styles.container}>
      {data.map((choice) => (
        <ScoreSheet {...choice} key={choice.koreanName} />
      ))}
    </div>
  );
}
