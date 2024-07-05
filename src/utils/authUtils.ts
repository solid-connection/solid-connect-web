import { loadRefreshToken, removeRefreshToken } from "./localStorage";
import { isTokenExpired } from "./jwtUtils";
import { reissueAccessTokenApi } from "@/services/auth";

export const checkAccessToken = async (accessToken: string | null) => {
  // accessToken이 만료되었거나 없을 경우 새 accessToken 발급
  if (!accessToken || isTokenExpired(accessToken)) {
    return await refreshAccessToken();
  }
  return accessToken;
};

export const refreshAccessToken = async () => {
  const refreshToken = loadRefreshToken();

  if (!refreshToken || isTokenExpired(refreshToken)) {
    removeRefreshToken();
    return null;
  }

  try {
    const newAccessToken = await reissueAccessTokenApi(refreshToken);
    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh access token", error);
    removeRefreshToken();
    return null;
  }
};
