import styles from "./my-modify.module.css";

import { MyInfo } from "@/types/myInfo";

type MyModifyProps = {
  myInfo: MyInfo;
};

export default function MyModify({ myInfo }: MyModifyProps) {
  const roleDisplay = {
    MENTO: "멘토",
    MENTEE: "멘티",
  };
  return (
    <div className={styles.modify}>
      <div className={styles.profile}>
        <div className={styles.role}>{myInfo.role ? roleDisplay[myInfo.role] : "멘티"}</div>
        <div className={styles.image}>
          <img src={myInfo.profileImageUrl} alt="프로필 이미지" />
        </div>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.form}>
          <div>이름</div>
          <div>{myInfo.nickname || "이름"}</div>
        </div>
        {/* <div className={styles.form}>
          <div>성별</div>
          <div>{gender || "미상"}</div>
        </div> */}
        <div className={styles.form}>
          <div>생년월일</div>
          <div>{myInfo.birth || "1970. 01. 01"}</div>
        </div>
        <div className={styles.form}>
          <div>출신학교</div>
          <div>{"인하대학교"}</div>
        </div>
        <div className={styles.form}>
          <div>파견학교</div>
          <div>{"미상"}</div>
        </div>
      </div>
    </div>
  );
}
