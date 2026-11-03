import useAuthStore from "@/lib/zustand/useAuthStore";
import { tokenParse } from "@/utils/jwtUtils";

export const getChatUserId = (accessToken: string | null): number | null => {
  const payload = tokenParse(accessToken);
  const userId = Number(payload?.sub);

  if (
    !payload ||
    (typeof payload.sub !== "number" && typeof payload.sub !== "string") ||
    !Number.isSafeInteger(userId) ||
    userId <= 0 ||
    typeof payload.exp !== "number" ||
    !Number.isFinite(payload.exp) ||
    payload.exp <= Math.floor(Date.now() / 1000)
  ) {
    return null;
  }

  return userId;
};

export const useChatUserId = (): number | null => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isInitialized && isAuthenticated ? getChatUserId(accessToken) : null;
};
