import ScoreSheet from "./score-sheet";

import styles from "./score-sheets.module.css";

export default function ScoreSheets(props) {
  const { sheets } = props;
  return (
    <div className={styles.container}>
      {sheets.map((scoreSheet) => (
        <ScoreSheet {...scoreSheet} key={scoreSheet.key} />
      ))}
    </div>
  );
}
