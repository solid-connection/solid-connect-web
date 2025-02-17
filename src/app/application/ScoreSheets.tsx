import Link from "next/link";
import { useState } from "react";

import styles from "./score-sheets.module.css";

import { LANGUAGE_TEST } from "@/constants/application";
import { ScoreSheet as ScoreSheetType } from "@/types/application";

import { IconExpandMoreFilled } from "@/public/svgs/community";
import { IconEditFilled } from "@/public/svgs/score";

const ScoreSheets = ({ scoreSheets }: { scoreSheets: ScoreSheetType[] }) => (
  <div className={styles.container}>
    {scoreSheets.map((choice) => (
      <ScoreSheet key={choice.koreanName} scoreSheet={choice} />
    ))}
  </div>
);

export default ScoreSheets;

const ScoreSheet = ({ scoreSheet }: { scoreSheet: ScoreSheetType }) => {
  const [tableOpened, setTableOpened] = useState(false);
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            {scoreSheet.koreanName} ({scoreSheet.applicants.length}/{scoreSheet.studentCapacity})
          </th>
          <th>
            <button
              onClick={() => {
                setTableOpened(!tableOpened);
              }}
              type="button"
              aria-label="더보기"
            >
              <IconExpandMoreFilled />
            </button>
          </th>
        </tr>
      </thead>
      {tableOpened && (
        <tbody>
          {scoreSheet.applicants.map((applicant) => (
            <tr key={applicant.nicknameForApply}>
              <td>{applicant.nicknameForApply}</td>
              <td>{applicant.gpa.toFixed(2)}</td>
              <td>{LANGUAGE_TEST[applicant.testType].toUpperCase()}</td>
              <td>{applicant.testScore}</td>
              <td>
                {applicant.isMine && (
                  <Link href="/application/apply">
                    <IconEditFilled />
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
};
