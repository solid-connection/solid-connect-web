import axios, { AxiosInstance } from "axios";

const convertToBearer = (token: string) => {
  return `Bearer ${token}`;
};

const token = {
  access: typeof window === "undefined" && typeof global !== "undefined" ? null : localStorage.getItem("accessToken"),
  refresh: typeof window === "undefined" && typeof global !== "undefined" ? null : localStorage.getItem("refreshToken"),
};

const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${token?.access}`,
  },
});

export default instance;

instance.interceptors.request.use(
  (config) => {
    console.log("config: ", config);
    config.headers["Authorization"] = `Bearer ${token?.access}`;
    return config;
  },
  (error) => {
    console.error("Error request: ", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    console.log("response: ", response);
    return response;
  },
  async (error) => {
    console.error("Error: ", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      try {
        const {
          data: {
            data: { accessToken },
          },
        } = await axios.post(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/reissue`, {}, { headers: { Authorization: `Bearer ${token?.refresh}` } });
        //refresh 유효한 경우 새롭게 accesstoken 설정
        window.localStorage.setItem("accessToken", accessToken);

        if (error?.config.headers === undefined) {
          error.config.headers = {};
        } else {
          error.config.headers["Authorization"] = convertToBearer(accessToken);
          localStorage.setItem("accessToken", accessToken);
          // 중단된 요청 새로운 토큰으로 재전송
          const originalResponse = error.config;
          return await axios.request(originalResponse);
        }
      } catch (err) {
        console.error(err);
        document.location.href = "/login"; // 로그인 페이지로 이동
      }
    } else {
      console.log("error not auth: ", error);
      throw error;
    }
  }
);
