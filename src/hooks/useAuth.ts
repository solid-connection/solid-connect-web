import { accessTokenState, isLoggedInState } from "@/states/authState";
import { checkAccessToken } from "@/utils/authUtils";
import { useRecoilState } from "recoil";

export function useAuth() {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);

  const getAccessToken = async () => {
    const newAccessToken = await checkAccessToken(accessToken);
    if (accessToken !== newAccessToken) {
      setAccessToken(newAccessToken);
    }
    if (newAccessToken === null) {
      setIsLoggedIn(false);
    }
    return newAccessToken;
  };

  return {
    getAccessToken,
    isLoggedIn,
  };
}
