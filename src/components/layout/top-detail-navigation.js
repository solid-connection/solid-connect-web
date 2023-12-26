import { useRouter } from "next/router";
import ArrowBackFilled from "../ui/icon/ArrowBackFilled";
import MenuFilled from "../ui/icon/MenuFilled";
import styles from "./top-detail-navigation.module.css";

export default function TopDetailNavigation(props) {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // 라우터의 back 함수를 사용하여 이전 페이지로 이동
  };

  return (
    <div className={styles.topNav}>
      <div className={styles.icon} onClick={handleBack}>
        <ArrowBackFilled />
      </div>
      <div className={styles.title}>{props.title}</div>
      <div className={styles.icon} onClick={props.onMore}>
        <MenuFilled />
      </div>
    </div>
  );
}
