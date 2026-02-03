import { useEffect, useRef, useState, type RefObject } from "react";

interface UseSectionHandlerReturn {
  sectionRef: RefObject<HTMLDivElement>;
  visible: boolean;
}

const useSectionHandler = (): UseSectionHandlerReturn => {
  const [visible, setVisible] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "0px",
        threshold: 0,
      },
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);
  return {
    sectionRef,
    visible,
  };
};

export default useSectionHandler;
