import type { ComponentType, SVGProps } from "react";

import { create } from "zustand";

export type AlertModalPayload = {
  icon?: ComponentType<SVGProps<SVGSVGElement>>; // SVG 컴포넌트만 허용
  title: string;
  content: string;
  /** 단일 버튼 텍스트 (기본값: "확인") */
  buttonText?: string;
};

interface AlertModalState {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 현재 모달에 표현될 데이터 */
  payload?: AlertModalPayload;
  /** 내부 Promise resolver */
  _resolver: (() => void) | null;

  /* -------- actions -------- */
  /** 모달을 열고 Promise 로 결과 반환 (확인 시 resolve) */
  ask: (payload: AlertModalPayload) => Promise<void>;
  /** 확인/닫기 버튼 클릭 */
  acknowledge: () => void;
  /** 외부에서 닫기 (Esc 등) */
  close: () => void;
}

export const useAlertModalStore = create<AlertModalState>((set, get) => ({
  isOpen: false,
  payload: undefined,
  _resolver: null,

  ask: (payload) =>
    new Promise<void>((resolve) => {
      set({ isOpen: true, payload, _resolver: resolve });
    }),

  acknowledge: () => {
    const { _resolver } = get();
    _resolver?.();
    set({ isOpen: false, payload: undefined, _resolver: null });
  },

  close: () => {
    const { _resolver } = get();
    _resolver?.();
    set({ isOpen: false, payload: undefined, _resolver: null });
  },
}));

export const customAlert = (payload: AlertModalPayload): Promise<void> => useAlertModalStore.getState().ask(payload);
