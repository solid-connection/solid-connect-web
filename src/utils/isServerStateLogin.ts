import { cookies } from "next/headers";

import { isTokenExpired } from "./jwtUtils";

const isServerStateLogin = (): boolean => {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const isLogin = refreshToken ? isTokenExpired(refreshToken) : false;
  return isLogin;
};
export default isServerStateLogin;
