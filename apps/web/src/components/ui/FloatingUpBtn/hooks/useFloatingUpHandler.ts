import { useCallback, useEffect, useState } from "react";

const useFloatingUpHandler = (scrollYThreshold: number = 400) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    if (window.scrollY > scrollYThreshold) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [scrollYThreshold]);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return { isVisible, handleClick };
};

export default useFloatingUpHandler;
