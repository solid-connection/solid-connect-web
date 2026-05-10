import type { ToastOptions } from "react-hot-toast";

const BASE_STYLE = {
  borderRadius: "0.5rem",
  color: "#ffffff",
};

export const infoToastOptions: ToastOptions = {
  duration: 3000,
  icon: "ℹ",
  style: {
    ...BASE_STYLE,
    background: "#111827",
  },
};

export const warningToastOptions: ToastOptions = {
  duration: 3000,
  icon: "⚠",
  style: {
    ...BASE_STYLE,
    background: "#f59e0b",
  },
};
