export const loadRefreshToken = () => {
  try {
    return localStorage.getItem("refreshToken");
  } catch (err) {
    console.error("Could not load refresh token", err);
    return null;
  }
};

export const saveRefreshToken = (token) => {
  try {
    localStorage.setItem("refreshToken", token);
  } catch (err) {
    console.error("Could not save refresh token", err);
  }
};

export const removeRefreshToken = () => {
  try {
    localStorage.removeItem("refreshToken");
  } catch (err) {
    console.error("Could not remove refresh token", err);
  }
};

export const loadAccessToken = () => {
  try {
    return localStorage.getItem("accessToken");
  } catch (err) {
    console.error("Could not load access token", err);
    return null;
  }
};

export const saveAccessToken = (token) => {
  try {
    localStorage.setItem("accessToken", token);
  } catch (err) {
    console.error("Could not save access token", err);
  }
};

export const removeAccessToken = () => {
  try {
    localStorage.removeItem("accessToken");
  } catch (err) {
    console.error("Could not remove access token", err);
  }
};
