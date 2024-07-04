// components/AuthInitializer.tsx
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { accessTokenState, isLoggedInState } from "@/states/authState";
import { getAccessToken } from "@/utils/authUtils";

export function AuthInitializer() {
  const setAccessToken = useSetRecoilState(accessTokenState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  useEffect(() => {
    const initializeAuth = async () => {
      const newAccessToken = await getAccessToken();
      if (newAccessToken) {
        setAccessToken(newAccessToken);
        setIsLoggedIn(true);
        alert("로그인 되었습니다.");
        console.log;
      } else {
        setIsLoggedIn(false);
        alert("로그인 되지 않았습니다.");
      }
    };

    initializeAuth();
  }, [setAccessToken, setIsLoggedIn]);

  return null; // This component doesn't render anything
}
