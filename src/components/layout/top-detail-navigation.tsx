import { useRouter } from "next/router";
import ArrowBackFilled from "../ui/icon/ArrowBackFilled";
import MenuFilled from "../ui/icon/MenuFilled";
import styles from "./top-detail-navigation.module.css";

interface TopDetailNavigationProps {
  title: string;
  handleBack?: () => void;
}

export default function TopDetailNavigation({ title, handleBack }: TopDetailNavigationProps) {
  const router = useRouter();

  const routeBack = () => {
    router.back(); // 라우터의 back 함수를 사용하여 이전 페이지로 이동
  };

  return (
    <div className={styles.topNav}>
      <div className={styles.icon} onClick={handleBack || routeBack}>
        <ArrowBackFilled />
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.icon}></div>
    </div>
  );
}
