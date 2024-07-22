import { useLayout } from "../../context/LayoutContext";
import BottomNavigation from "./bottom-navigation";
import styles from "./layout.module.css";

export default function Layout(props) {
  const { hideBottomNavigation } = useLayout();
  return (
    <div className={styles.layout}>
      {props.children}
      {!hideBottomNavigation && <BottomNavigation />}
    </div>
  );
}
