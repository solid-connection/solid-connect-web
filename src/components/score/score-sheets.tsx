import { useState } from "react";
import { LANGUAGE_TEST } from "../../constants/languateTest";
import { ScoreSheet } from "@/types/application";

import styles from "./score-sheets.module.css";
import ExpendMoreFilled from "../ui/icon/ExpendMoreFilled";

export default function ScoreSheets({ scoreSheets }: { scoreSheets: ScoreSheet[] }) {
  return (
    <div className={styles.container}>
      {scoreSheets.map((choice) => (
        <ScoreSheet {...choice} key={choice.koreanName} />
      ))}
    </div>
  );
}

export function ScoreSheet({ koreanName, studentCapacity, region, country, applicants }: ScoreSheet) {
  const [tableOpened, setTableOpened] = useState(false);
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            {koreanName} ({applicants.length}/{studentCapacity})
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
              <td>{LANGUAGE_TEST[applicant.testType]}</td>
              <td>{applicant.testScore}</td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
}
