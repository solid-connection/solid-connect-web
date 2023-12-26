import Link from "next/link";
import { useRouter } from "next/router";

import FavoriteFilled from "../ui/FavoriteFilled";
import styles from "./bottom-navigation.module.css";

function BottomNavigation() {
  const router = useRouter();

  const specificRoutes = ["/college", "/community", "/mento", "/my"];
  const isSpecificRouteActive = specificRoutes.some((specificRoute) => router.pathname.startsWith(specificRoute));

  const navs = [
    {
      route: "/college",
      text: "학교",
      isActive: router.pathname.startsWith("/college"),
    },
    {
      route: "/community",
      text: "커뮤니티",
      isActive: router.pathname.startsWith("/community"),
    },
    {
      route: "/",
      text: "홈",
      isActive: !isSpecificRouteActive,
    },
    {
      route: "/mento",
      text: "멘토",
      isActive: router.pathname.startsWith("/mento"),
    },
    {
      route: "/my",
      text: "마이",
      isActive: router.pathname.startsWith("/my"),
    },
  ];

  return (
    <nav className={styles.bottom_nav}>
      {navs.map((nav, index) => (
        <Link key={index} href={nav.route} className={styles.nav_item}>
          <div className={styles.nav_icon}>
            <FavoriteFilled color={nav.isActive ? "#1976D2" : "black"} />
          </div>
          <span className={nav.isActive ? styles.nav_text_active : styles.nav_text}>{nav.text}</span>
        </Link>
      ))}
    </nav>
  );
}

export default BottomNavigation;
