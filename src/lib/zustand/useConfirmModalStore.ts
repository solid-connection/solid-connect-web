import React from "react";

import { create } from "zustand";

export type ConfirmModalPayload = {
  icon?: React.ReactNode | string; // 아이콘 컴포넌트 또는 URL
  title: string;
  content: string;
  // approveMessage: text for the confirm/approve button (default "확인")
  approveMessage?: string; // default "확인"
  // rejectMessage: text for the reject/cancel button (default "취소")
  rejectMessage?: string; // default "취소"
};

interface ConfirmModalState {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 현재 모달에 표현될 데이터 */
  payload?: ConfirmModalPayload;
  /** 내부 Promise resolver */
  _resolver: ((confirmed: boolean) => void) | null;

  /* -------- actions -------- */
  /** 모달을 열고 Promise 로 결과 반환 */
  ask: (payload: ConfirmModalPayload) => Promise<boolean>;
  /** 확인 버튼 클릭  */
  confirm: () => void;
  /** 닫기 / 취소 */
  reject: () => void;
}

export const useConfirmModalStore = create<ConfirmModalState>((set, get) => ({
  isOpen: false,
  payload: undefined,
  _resolver: null,

  /** 모달 open + Promise */
  ask: (payload) =>
    new Promise<boolean>((resolve) => {
      set({ isOpen: true, payload, _resolver: resolve });
    }),

  /** 확인 눌렀을 때 */
  confirm: () => {
    const { _resolver } = get();
    _resolver?.(true);
    set({ isOpen: false, payload: undefined, _resolver: null });
  },

  /** 취소 / 닫기 */
  reject: () => {
    const { _resolver } = get();
    _resolver?.(false);
    set({ isOpen: false, payload: undefined, _resolver: null });
  },
}));

// 커스텀 confirm 함수
export const customConfirm = (payload: ConfirmModalPayload): Promise<boolean> =>
  useConfirmModalStore.getState().ask(payload);
