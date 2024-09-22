import { useEffect, useState } from "react";

import styles from "./post-write-button.module.css";

import { IconObjectsAndTools } from "@/public/svgs";

type PostWriteButtonProps = {
  onClick: () => void;
};

export default function PostWriteButton({ onClick }: PostWriteButtonProps) {
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
      <button className={styles.button} onClick={onClick} type="button" aria-label="글쓰기">
        <div className={styles.icon}>
          <IconObjectsAndTools />
        </div>
      </button>
    </div>
  );
}
