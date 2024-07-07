import { useState } from "react";
import { LANGUAGE_TEST } from "@/constants/application";
import { ScoreSheet } from "@/types/application";

import styles from "./score-sheets.module.css";
import ExpendMoreFilled from "../ui/icon/ExpendMoreFilled";
import EditFilled from "../ui/icon/EditFilled";
import Link from "next/link";

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
              <td>{applicant.nicknameForApply}</td>
              <td>{applicant.gpa.toFixed(2)}</td>
              <td>{LANGUAGE_TEST[applicant.testType].toUpperCase()}</td>
              <td>{applicant.testScore}</td>
              <td>
                {applicant.mine && (
                  <Link href={`/score/college-register`}>
                    <EditFilled />
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
}
