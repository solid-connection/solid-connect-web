import { useCallback, useEffect, useRef } from "react";

type UseInfinityScrollProps = {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isDirectionTop?: boolean;
};

type UseInfinityScrollReturn = {
  lastElementRef: (node: Element | null) => void;
};

const useInfinityScroll = ({
  fetchNextPage,
  hasNextPage,
  isDirectionTop = false,
}: UseInfinityScrollProps): UseInfinityScrollReturn => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  /** 마지막 요소에 부착할 ref */
  const lastElementRef = useCallback(
    (node: Element | null) => {
      if (!hasNextPage) return; // 더 이상 로드할 페이지가 없으면 early return
      if (observerRef.current) observerRef.current.disconnect();
      if (!node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            fetchNextPage();
          }
        },
        {
          rootMargin: isDirectionTop ? "200px 0px 0px 0px" : "0px 0px 200px 0px",
          threshold: 0,
        },
      );

      observerRef.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isDirectionTop],
  );

  // 컴포넌트 언마운트 시 observer 해제
  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return { lastElementRef };
};

export default useInfinityScroll;
