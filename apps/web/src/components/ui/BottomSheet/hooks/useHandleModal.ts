import { type MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";

// 드래그 핸들에서 제외해야 하는 인터랙티브 엘리먼트 판별
const isInteractiveElement = (el: EventTarget | null): boolean => {
  return el instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A", "LABEL"].includes(el.tagName);
};

interface UseHandleModalReturn {
  isVisible: boolean;
  translateY: number;
  isDraggingRef: MutableRefObject<boolean>;
  handleClose: () => void;
  handleTouchStart: (e: React.TouchEvent | React.MouseEvent) => void;
  handleTouchMove: (e: React.TouchEvent | React.MouseEvent) => void;
  handleTouchEnd: () => void;
}

const useHandleModal = (onClose: () => void, snap: number[] = [0]): UseHandleModalReturn => {
  const [isVisible, setIsVisible] = useState<boolean>(false); // 열림 상태
  const [translateY, setTranslateY] = useState<number>(0); // 바텀시트 위치

  const startYRef = useRef<number>(0); // 시작 Y좌표
  const currentYRef = useRef<number>(0); // 현재 Y좌표
  const isDraggingRef = useRef<boolean>(false); // 드래그 상태

  const snapPoints = useMemo((): number[] => {
    if (typeof window === "undefined") return [0]; // SSR 대응

    const points = new Set<number>([0]); // Set으로 중복 제거
    const screenHeight: number = window.innerHeight;

    // 사용자 정의 스냅 포인트들 추가
    snap.forEach((item: number) => {
      points.add(-screenHeight * item);
    });

    // 가장 상단 스냅 포인트 추가 (화면 높이의 90% 위로)
    points.add(-screenHeight * 0.9);

    return Array.from(points).sort((a: number, b: number) => a - b);
  }, [snap]);

  useEffect(() => {
    setIsVisible(true); // Open 애니메이션 실행
  }, []);

  const handleClose = useCallback((): void => {
    setIsVisible(false);
    setTimeout((): void => {
      if (onClose) onClose();
    }, 300);
  }, [onClose]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent): void => {
      // input·textarea 등은 기본 동작(포커스) 유지
      if (isInteractiveElement(e.target)) {
        return;
      }

      if (!isVisible) return;

      e.preventDefault();

      isDraggingRef.current = true;
      const clientY: number = "touches" in e ? e.touches[0].clientY : e.clientY;
      startYRef.current = clientY;
      currentYRef.current = translateY;
    },
    [isVisible, translateY],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent): void => {
      if (!isDraggingRef.current || !isVisible) return;

      // 기본 스크롤 동작 방지
      e.preventDefault();

      const clientY: number = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaY: number = clientY - startYRef.current;

      // requestAnimationFrame으로 부드러운 애니메이션
      requestAnimationFrame((): void => {
        setTranslateY(currentYRef.current + deltaY);
      });
    },
    [isVisible],
  );

  const handleTouchEnd = useCallback((): void => {
    if (!isVisible || !isDraggingRef.current) return;

    isDraggingRef.current = false;

    // 50px 이상 아래로 드래그하면 닫기
    if (translateY > 50) {
      handleClose();
      return;
    }

    // 가장 가까운 스냅 포인트로 이동
    if (snapPoints.length > 0) {
      const closestSnapPoint: number = snapPoints.reduce((closest: number, current: number): number => {
        return Math.abs(current - translateY) < Math.abs(closest - translateY) ? current : closest;
      });

      // 부드러운 스냅 애니메이션
      requestAnimationFrame((): void => {
        setTranslateY(closestSnapPoint);
      });
    }
  }, [isVisible, translateY, snapPoints, handleClose]);

  return {
    isVisible,
    translateY,
    isDraggingRef,
    handleClose,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};

export default useHandleModal;
