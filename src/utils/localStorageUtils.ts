export const saveAccessTokenToLS = (token: string) => {
  localStorage.setItem("accessToken", token);
};

export const removeAccessTokenToLS = () => {
  localStorage.removeItem("accessToken");
};
