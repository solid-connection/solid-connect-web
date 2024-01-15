import { useState } from "react";
import styles from "./score-sheet.module.css";
import ExpendMoreFilled from "../ui/icon/ExpendMoreFilled";

export default function ScoreSheet(props) {
  const { college, scores } = props;
  const [tableOpened, setTableOpened] = useState(false);
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            {college} ({3})
          </th>
          <th>
            <button
              onClick={() => {
                setTableOpened(!tableOpened);
              }}
            >
              <ExpendMoreFilled />
            </button>
          </th>
        </tr>
      </thead>
      {tableOpened && (
        <tbody>
          {scores.map((score) => (
            <tr key={score.key}>
              <td>{score.key}</td>
              <td>{score.name}</td>
              <td>{score.score}</td>
              <td>{score.languageType}</td>
              <td>{score.languageScore}</td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
}
