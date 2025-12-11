import React from "react";

import clsx from "clsx";

import useHandleModal from "@/components/ui/BottomSheet/hooks/useHandleModal";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  titleChild?: React.ReactNode;
  snap?: number[]; // 스냅 포인트 배열
}

const DEFAULT_SNAP = [0];

const BottomSheet = ({ isOpen, onClose, children, titleChild, snap = DEFAULT_SNAP }: BottomSheetProps) => {
  const {
    elementRef,
    isVisible,
    translateY,
    isDraggingRef,
    handleClose,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useHandleModal(onClose, snap);

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40"
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            handleClose();
          }
        }}
        role="button"
        tabIndex={-1}
        aria-label="모달 닫기"
      />

      {/* 바텀 시트 */}
      <div
        ref={elementRef}
        className={clsx(
          "fixed bottom-0 left-0 z-50 flex h-[90vh] max-h-screen w-full flex-col rounded-t-2xl bg-white shadow-2xl",
          !isDraggingRef.current && "transition-transform duration-300 ease-out",
          !isDraggingRef.current && isVisible && "translate-y-0",
          !isDraggingRef.current && !isVisible && "translate-y-full",
        )}
        style={
          isDraggingRef.current || translateY !== 0
            ? { transform: `translateY(${isVisible ? translateY : 600}px)` }
            : {}
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleChild ? "bottom-sheet-title" : undefined}
      >
        {/* 확장된 배경 (바텀시트 아래 영역을 흰색으로 채우기) */}
        <div className="absolute left-0 top-full h-screen w-full bg-white" />

        {/* 드래그 핸들 (드래그 전용 이벤트 바인딩) */}
        <button
          className="flex justify-center py-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={() => {
            if (isDraggingRef.current) {
              handleTouchEnd();
            }
          }}
        >
          <span className="h-1 w-12 cursor-grab rounded-full bg-gray-300 transition-colors hover:bg-gray-400 active:cursor-grabbing" />
        </button>

        {/* 헤더 (옵션) */}
        {titleChild && (
          <div className="flex-shrink-0 px-6 pb-4">
            <div
              id="bottom-sheet-title"
              className="flex items-center justify-between typo-sb-5 text-gray-800"
            >
              {titleChild}
            </div>
          </div>
        )}

        {/* 콘텐츠 */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 pb-6">{children}</div>
        </div>
      </div>
    </>
  );
};

export default BottomSheet;
