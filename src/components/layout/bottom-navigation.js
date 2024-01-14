import Link from "next/link";
import { useRouter } from "next/router";

import FavoriteFilled from "../ui/FavoriteFilled";
import styles from "./bottom-navigation.module.css";
import DegreeHat from "./icon/DegreeHat";
import EditTwo from "./icon/EditTwo";
import Home from "./icon/Home";
import WhatsNew from "./icon/WhatsNew";
import Human from "./icon/Human";

function BottomNavigation() {
  const router = useRouter();

  const specificRoutes = ["/college", "/community", "/mento", "/my"];
  const isSpecificRouteActive = specificRoutes.some((specificRoute) => router.pathname.startsWith(specificRoute));

  const navs = [
    {
      route: "/college",
      text: "학교",
      isActive: router.pathname.startsWith("/college"),
      icon: <DegreeHat />,
    },
    {
      route: "/community",
      text: "커뮤니티",
      isActive: router.pathname.startsWith("/community"),
      icon: <EditTwo />,
    },
    {
      route: "/",
      text: "홈",
      isActive: !isSpecificRouteActive,
      icon: <Home />,
    },
    {
      route: "/mento",
      text: "멘토",
      isActive: router.pathname.startsWith("/mento"),
      icon: <WhatsNew />,
    },
    {
      route: "/my",
      text: "마이",
      isActive: router.pathname.startsWith("/my"),
      icon: <Human />,
    },
  ];

  return (
    <nav className={styles.bottom_nav}>
      {navs.map((nav, index) => (
        <Link key={index} href={nav.route} className={styles.nav_item}>
          <div className={styles.nav_icon}>
            {/* <FavoriteFilled color={nav.isActive ? "#1976D2" : "black"} /> */}
            {nav.icon}
          </div>
          <span className={nav.isActive ? styles.nav_text_active : styles.nav_text}>{nav.text}</span>
        </Link>
      ))}
    </nav>
  );
}

export default BottomNavigation;
