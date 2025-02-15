import { isTokenExpired } from "./jwtUtils";
import { loadAccessToken, loadRefreshToken } from "./localStorage";

export const isAuthenticated = () => {
  if (!isTokenExpired(loadAccessToken()) || !isTokenExpired(loadRefreshToken())) {
    return true;
  }
  return false;
};

export const authProviderName = (provider: "KAKAO" | "APPLE" | "EMAIL"): string => {
  if (provider === "KAKAO") {
    return "카카오";
  } else if (provider === "APPLE") {
    return "애플";
  } else if (provider === "EMAIL") {
    return "이메일";
  } else {
    return "";
  }
};
