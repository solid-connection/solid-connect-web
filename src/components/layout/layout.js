import styles from "./layout.module.css";
import BottomNavigation from "./bottom-navigation";

function Layout(props) {
  return (
    <div className={styles.layout}>
      {props.children}
      <BottomNavigation />
    </div>
  );
}

export default Layout;
