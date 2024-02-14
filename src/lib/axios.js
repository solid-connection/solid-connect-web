// import axios from "axios";
// import Cookies from "js-cookie";
// import nextCookies from "next-cookies";

// // Axios 인스턴스 생성
// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // 요청 인터셉터 설정
// apiClient.interceptors.request.use(
//   (config) => {
//     const { accessToken } = nextCookies({ req: config.headers.cookie });
//     if (accessToken) {
//       config.headers["Authorization"] = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // 응답 인터셉터 설정
// apiClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const refreshToken = Cookies.get("refreshToken");
//         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/reissue`, {
//           refreshToken,
//         });

//         if (!response.data.success) {
//           throw new Error(response.data.error);
//         }

//         const { accessToken } = response.data.data;
//         Cookies.set("accessToken", accessToken);

//         apiClient.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
//         originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;
