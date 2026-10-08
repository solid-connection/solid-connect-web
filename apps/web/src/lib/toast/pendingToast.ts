import type { ToastIconKey } from "./showIconToast";

const PENDING_TOAST_STORAGE_KEY = "pendingToast";

type PendingToast = {
  icon: ToastIconKey;
  message: string;
};

/**
 * 다음 페이지 로드 때 보여줄 토스트를 예약한다.
 *
 * `window.location.replace()` 같은 하드 내비게이션은 React 트리를 통째로 버리기 때문에,
 * 이동 직전에 띄운 토스트는 화면에 나타나기도 전에 사라진다.
 * 그래서 메시지를 sessionStorage 에 넘겨두고 도착한 페이지에서 대신 띄운다.
 *
 * SPA 이동(next/navigation 의 router.push/replace)은 트리가 유지되므로
 * 이 함수가 아니라 showIconToast 를 그대로 쓰면 된다.
 */
export const setPendingToast = (icon: ToastIconKey, message: string) => {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(PENDING_TOAST_STORAGE_KEY, JSON.stringify({ icon, message } satisfies PendingToast));
  } catch {
    // sessionStorage 를 못 쓰는 환경(프라이빗 모드 등)에서는 토스트를 포기한다.
  }
};

/** 예약된 토스트를 읽고 즉시 비운다. (같은 메시지가 다음 이동에서 또 뜨지 않도록) */
export const consumePendingToast = (): PendingToast | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(PENDING_TOAST_STORAGE_KEY);
    if (!raw) return null;

    sessionStorage.removeItem(PENDING_TOAST_STORAGE_KEY);

    const parsed = JSON.parse(raw) as Partial<PendingToast>;
    if (!parsed?.message || !parsed?.icon) return null;

    return { icon: parsed.icon, message: parsed.message };
  } catch {
    return null;
  }
};
