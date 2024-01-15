import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./bottom-navigation.module.css";
import DegreeHat from "./icon/DegreeHat";
import EditTwo from "./icon/EditTwo";
import Home from "./icon/Home";
import WhatsNew from "./icon/WhatsNew";
import Human from "./icon/Human";
import FavoriteFilled from "../ui/FavoriteFilled";

export default function BottomNavigation() {
  const router = useRouter();

  const specificRoutes = ["/college", "/community", "/mento", "/my"];
  const isSpecificRouteActive = specificRoutes.some((specificRoute) => router.pathname.startsWith(specificRoute));

  const navs = [
    {
      route: "/college",
      text: "학교",
      isActive: router.pathname.startsWith("/college"),
      icon: <DegreeHat color={router.pathname.startsWith("/college") ? "#6F96D1" : "#707070"} />,
    },
    {
      route: "/community",
      text: "커뮤니티",
      isActive: router.pathname.startsWith("/community"),
      icon: <EditTwo color={router.pathname.startsWith("/community") ? "#6F96D1" : "#707070"} />,
    },
    {
      route: "/",
      text: "홈",
      isActive: !isSpecificRouteActive,
      icon: <Home color={!(router.pathname.startsWith("/college") || router.pathname.startsWith("/community") || router.pathname.startsWith("/mento") || router.pathname.startsWith("/my")) ? "#6F96D1" : "#707070"} />,
    },
    {
      route: "/mento",
      text: "멘토",
      isActive: router.pathname.startsWith("/mento"),
      icon: <WhatsNew color={router.pathname.startsWith("/mento") ? "#6F96D1" : "#707070"} />,
    },
    {
      route: "/my",
      text: "마이",
      isActive: router.pathname.startsWith("/my"),
      icon: <Human color={router.pathname.startsWith("/my") ? "#6F96D1" : "#707070"} />,
    },
  ];

  return (
    <nav className={styles.bottom_nav}>
      {navs.map((nav, index) => (
        <Link key={index} href={nav.route} className={styles.nav_item}>
          {nav.icon}
          <span className={nav.isActive ? styles.nav_text_active : styles.nav_text}>{nav.text}</span>
        </Link>
      ))}
    </nav>
  );
}
