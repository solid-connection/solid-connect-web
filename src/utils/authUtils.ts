import { loadRefreshToken, removeRefreshToken } from "./localStorage";
import { isTokenExpired } from "./jwtUtils";
import { reissueAccessTokenApi } from "@/services/auth";

export const getAccessToken = async () => {
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
