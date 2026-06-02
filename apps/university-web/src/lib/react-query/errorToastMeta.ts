export type ErrorToastMeta = {
  skipGlobalErrorToast?: boolean;
};

export const SKIP_GLOBAL_ERROR_TOAST_META: ErrorToastMeta = {
  skipGlobalErrorToast: true,
};

export const shouldSkipGlobalErrorToast = (meta: unknown): boolean => {
  if (!meta || typeof meta !== "object") return false;

  return (meta as ErrorToastMeta).skipGlobalErrorToast === true;
};
