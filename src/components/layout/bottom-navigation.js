import Link from "next/link";
import FavoriteFilled from "../ui/FavoriteFilled";
import classes from "./bottom-navigation.module.css";

function BottomNavigation() {
  return (
    <nav className={classes.bottom_nav}>
      <Link href="/university" className={classes.nav_item}>
        <div className={classes.nav_icon}>
          <FavoriteFilled />
        </div>
        <span className={classes.nav_text}>학교</span>
      </Link>
      <Link href="/community" className={classes.nav_item}>
        <div className={classes.nav_icon}>
          <FavoriteFilled />
        </div>
        <span className={classes.nav_text}>커뮤니티</span>
      </Link>
      <Link href="/" className={classes.nav_item}>
        <div className={classes.nav_icon}>
          <FavoriteFilled />
        </div>
        <span className={classes.nav_text}>홈</span>
      </Link>
      <Link href="/mento" className={classes.nav_item}>
        <div className={classes.nav_icon}>
          <FavoriteFilled />
        </div>
        <span className={classes.nav_text}>멘토</span>
      </Link>
      <Link href="/my" className={classes.nav_item}>
        <div className={classes.nav_icon}>
          <FavoriteFilled />
        </div>
        <span className={classes.nav_text}>마이</span>
      </Link>
    </nav>
  );
}

export default BottomNavigation;
