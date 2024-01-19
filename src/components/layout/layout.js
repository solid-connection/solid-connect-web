import styles from "./layout.module.css";
import BottomNavigation from "./bottom-navigation";

function Layout(props) {
  return (
    <div>
      <div className={styles.layout}>
        {props.children}
        <BottomNavigation />
      </div>
    </div>
  );
}

export default Layout;
