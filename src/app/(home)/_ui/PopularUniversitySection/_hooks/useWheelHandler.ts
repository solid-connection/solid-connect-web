import { useEffect, useRef } from "react";

const useWheelHandler = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: WheelEvent) => {
    if (containerRef.current) {
      e.preventDefault();
      containerRef.current.scrollLeft += e.deltaY;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel as unknown as EventListener, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel as unknown as EventListener);
      }
    };
  }, []);

  return {
    containerRef,
  };
};

export default useWheelHandler;
