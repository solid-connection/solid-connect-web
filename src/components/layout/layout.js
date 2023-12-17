import BottomNavigation from "./bottom-navigation";
import classes from "./layout.module.css";

function Layout(props) {
  return (
    <div className={classes.background}>
      <div className={classes.layout}>
        {props.children}
        <BottomNavigation />
      </div>
    </div>
  );
}

export default Layout;
