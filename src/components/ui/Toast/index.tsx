"use client";

import { useEffect } from "react";

import { Toast as ToastType, useToastStore } from "@/lib/zustand/useToastStore";

const Toast = ({ toast }: { toast: ToastType }) => {
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, removeToast]);

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-yellow-500 text-white";
      case "info":
      default:
        return "bg-k-900 text-white";
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return "✓";
      case "error":
        return "⚠";
      case "warning":
        return "⚠";
      case "info":
      default:
        return "ℹ";
    }
  };

  return (
    <div
      className={`${getToastStyles()} animate-slide-in mb-2 flex min-w-[280px] max-w-md items-center gap-3 rounded-lg px-4 py-3 shadow-lg`}
      role="alert"
    >
      <span className="typo-bold-3">{getIcon()}</span>
      <p className="flex-1 font-serif typo-medium-2">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="ml-2 typo-bold-3 opacity-70 transition hover:opacity-100"
        type="button"
        aria-label="닫기"
      >
        ×
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] flex flex-col items-center justify-start gap-2 p-4 pt-20">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
