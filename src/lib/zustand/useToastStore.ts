import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = "info", duration = 3000) => {
    const id = `${Date.now()}-${Math.random()}`;
    const toast: Toast = { id, message, type, duration };

    set((state) => ({ toasts: [...state.toasts, toast] }));

    // 자동으로 토스트 제거
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

// 편리한 헬퍼 함수들
export const toast = {
  success: (message: string, duration?: number) => useToastStore.getState().addToast(message, "success", duration),
  error: (message: string, duration?: number) => useToastStore.getState().addToast(message, "error", duration),
  info: (message: string, duration?: number) => useToastStore.getState().addToast(message, "info", duration),
  warning: (message: string, duration?: number) => useToastStore.getState().addToast(message, "warning", duration),
};
