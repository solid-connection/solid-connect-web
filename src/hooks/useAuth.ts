import { useRouter } from "next/navigation";

import { useTokenStore } from "@/stores/tokenStore";

export const useAuth = () => {
  const { accessToken, setAccessToken, clearAccessToken } = useTokenStore();
  const router = useRouter();

  const login = (token: string) => {
    setAccessToken(token);
  };

  const logout = () => {
    clearAccessToken();
    router.push("/login");
  };

  const isAuthenticated = !!accessToken;

  return {
    accessToken,
    isAuthenticated,
    login,
    logout,
  };
};
