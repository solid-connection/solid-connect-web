import { useEffect, useState } from "react";

import styles from "./post-write-button.module.css";

import { IconObjectsAndTools } from "@/public/svgs";

export default function PostWriteButton(props) {
  const { onClick } = props;
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`${styles["button-wrapper"]} ${isVisible ? styles["button-visible"] : styles["button-hidden"]}`}>
      <div className={styles.button} onClick={onClick}>
        <div className={styles.icon}>
          <IconObjectsAndTools />
        </div>
      </div>
    </div>
  );
}
