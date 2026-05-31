import { cookies } from "next/headers";

import { isTokenExpired } from "./jwtUtils";

const isServerStateLogin = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const isLogin = !!(refreshToken && !isTokenExpired(refreshToken));
  return isLogin;
};
export default isServerStateLogin;
