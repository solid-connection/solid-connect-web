import Link from "next/link";

import EditFilled from "../ui/icon/EditFilled";
import styles from "./my-profile.module.css";

export default function MyProfile(props) {
  const { nickname, profileImageUrl, role, birth, email } = props;
  const roleDisplay = {
    MENTO: "Mento",
    MENTEE: "Mentee",
  };
  return (
    <div className={styles.profile}>
      <div className={styles.imageWrapper}>
        <img src={profileImageUrl} alt="프로필 이미지" />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>
          <div>{nickname || "닉네임"}</div>
          <Link href="/my/modify">
            <EditFilled />
          </Link>
        </div>
        <div className={styles.subInfo}>
          <div className={styles.role}>{role in roleDisplay ? roleDisplay[role] : "역할"}</div>
          <div className={styles.date}>{birth ? birth.replace(/-/g, ".") : "0000.00.00"}</div>
        </div>
        <div style={{ marginTop: "12px" }} className={styles.smText}>
          {"inha university" || "inha university"}
        </div>
        <div style={{ marginTop: "4px" }} className={styles.smText}>
          {email || "이메일"}
        </div>
      </div>
    </div>
  );
}
