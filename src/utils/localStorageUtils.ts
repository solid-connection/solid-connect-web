export const saveAccessTokenToLS = (token: string) => {
  localStorage.setItem("accessToken", token);
};

export const removeAccessTokenToLS = () => {
  localStorage.removeItem("accessToken");
};

export const getAccessTokenFromLS = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};
