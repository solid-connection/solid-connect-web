import { isTokenExpired } from "@/utils/jwtUtils";
import { loadRefreshToken } from "@/utils/localStorage";
import { atom, selector } from "recoil";

export const isLoggedInState = atom<boolean>({
  key: "isLoggedInState",
  default: false,
});

export const accessTokenState = atom<string | null>({
  key: "accessTokenState",
  default: null,
});
