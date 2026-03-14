import { useCallback, useEffect, useState } from "react";

interface FloatingUpBtnProps {
  scrollYThreshold?: number;
}

const FloatingUpBtn = ({ scrollYThreshold = 400 }: FloatingUpBtnProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setIsVisible(window.scrollY > scrollYThreshold);
  }, [scrollYThreshold]);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  if (!isVisible) return null;
  return (
    <button
      className="fixed bottom-20 left-1/2 flex h-10 w-10 -translate-x-1/2 transform items-center justify-center rounded-full bg-primary-100 p-0 text-primary shadow-lg"
      onClick={handleClick}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};
export default FloatingUpBtn;
