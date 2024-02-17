import { useState } from "react";
import styles from "./score-sheet.module.css";
import ExpendMoreFilled from "../ui/icon/ExpendMoreFilled";

export default function ScoreSheet(props) {
  const { koreanName, studentCapacity, applicants } = props;
  const [tableOpened, setTableOpened] = useState(false);
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            {koreanName} ({applicants.length})
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
          {applicants.map((applicant, index) => (
            <tr key={applicant.nicknameForApply}>
              <td>{index + 1}</td>
              <td>{applicant.nicknameForApply}</td>
              <td>{applicant.gpa}</td>
              <td>{applicant.testType}</td>
              <td>{applicant.testSore}</td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
}
