import { useLayout } from "../../context/LayoutContext";
import styles from "./layout.module.css";
import BottomNavigation from "./bottom-navigation";

export default function Layout(props) {
  const { hideBottomNavigation } = useLayout();
  return (
    <div className={styles.layout}>
      {props.children}
      {!hideBottomNavigation && <BottomNavigation />}
    </div>
  );
}
