import { useCallback, useEffect, useRef } from "react";

const useInfinityScroll = (fetchNextPage: () => void) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  /** 마지막 요소에 부착할 ref */
  const lastElementRef = useCallback((node: Element | null) => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!node) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "0px 0px 200px 0px", // 하단 여유
        threshold: 0,
      },
    );

    observerRef.current.observe(node);
  }, []);

  // 컴포넌트 언마운트 시 observer 해제
  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return { lastElementRef };
};

export default useInfinityScroll;
