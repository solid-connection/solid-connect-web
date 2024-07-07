import { isTokenExpired } from "./jwtUtils";
import { loadAccessToken, loadRefreshToken } from "./localStorage";

export const isAuthenticated = () => {
  if (!isTokenExpired(loadAccessToken()) || !isTokenExpired(loadRefreshToken())) {
    return true;
  }
  return false;
};
