type AuthDebugDetails = Record<string, unknown>;

type AuthDebugEvent = {
  at: string;
  event: string;
  details: AuthDebugDetails;
};

declare global {
  interface Window {
    __AUTH_DEBUG_LOGS__?: AuthDebugEvent[];
  }
}

const AUTH_DEBUG_STORAGE_KEY = "authDebug";

const isAuthDebugEnabled = (): boolean => {
  const envEnabled = process.env.NEXT_PUBLIC_AUTH_DEBUG === "true";

  if (typeof window === "undefined") {
    return envEnabled;
  }

  try {
    const storageEnabled = window.localStorage.getItem(AUTH_DEBUG_STORAGE_KEY) === "1";
    return envEnabled || storageEnabled;
  } catch {
    return envEnabled;
  }
};

export const authDebugLog = (event: string, details: AuthDebugDetails = {}): void => {
  if (!isAuthDebugEnabled()) return;

  const payload: AuthDebugEvent = {
    at: new Date().toISOString(),
    event,
    details,
  };

  if (typeof window !== "undefined") {
    window.__AUTH_DEBUG_LOGS__ = window.__AUTH_DEBUG_LOGS__ ?? [];
    window.__AUTH_DEBUG_LOGS__.push(payload);
  }

  console.info("[AUTH_DEBUG]", payload);
};
