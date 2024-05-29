// AuthContext.js

import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 여기서 refreshToken의 존재 여부에 따라 isLoggedIn 상태를 업데이트합니다.
    const refreshToken = getRefreshToken(); // refreshToken 가져오는 함수 필요
    setIsLoggedIn(!!refreshToken);
  }, []);

  const login = () => {
    // 로그인 시 로직
    setIsLoggedIn(true);
  };

  const logout = () => {
    // 로그아웃 시 로직
    setIsLoggedIn(false);
  };

  return <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
