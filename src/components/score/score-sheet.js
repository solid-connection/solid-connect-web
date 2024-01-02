import styles from "./score-sheet.module.css";

export default function ScoreSheet(props) {
  const { college, scores } = props;
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>{college}</th>
          <th>4.5</th>
          <th>880</th>
          <th>우선순위</th>
        </tr>
      </thead>
      {scores.map((score) => (
        <tbody>
          <tr key={score.key}>
            <td>{college}</td>
            <td>{score.score}</td>
            <td>{score.count}</td>
            <td>우선순위</td>
          </tr>
        </tbody>
      ))}
    </table>
  );
}
