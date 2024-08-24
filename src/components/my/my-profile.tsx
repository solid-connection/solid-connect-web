import Link from "next/link";

import EditFilled from "../ui/icon/EditFilled";
import styles from "./my-profile.module.css";

import { MyInfo } from "@/types/myInfo";

type MyProfileProps = {
  myInfo: MyInfo;
};

export default function MyProfile({ myInfo }: MyProfileProps) {
  const roleDisplay = {
    MENTO: "Mento",
    MENTEE: "Mentee",
  };
  return (
    <div className={styles.profile}>
      <div className={styles.imageWrapper}>
        <img src={myInfo.profileImageUrl} alt="프로필 이미지" />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>
          <div>{myInfo.nickname || "닉네임"}</div>
          <Link href="/my/modify">
            <EditFilled />
          </Link>
        </div>
        <div className={styles.subInfo}>
          <div className={styles.role}>{myInfo.role in roleDisplay ? roleDisplay[myInfo.role] : "역할"}</div>
          <div className={styles.date}>{myInfo.birth ? myInfo.birth.replace(/-/g, ".") : "1970.01.01"}</div>
        </div>
        <div style={{ marginTop: "12px" }} className={styles.smText}>
          {"inha university"}
        </div>
        <div style={{ marginTop: "4px" }} className={styles.smText}>
          {/* {"이메일"} */}
        </div>
      </div>
    </div>
  );
}
