import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as Slot } from "../_chunks/_libs/@radix-ui/react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as axios } from "../_libs/axios.mjs";
import { l as loadAccessToken, i as isTokenExpired, b as loadRefreshToken, r as removeAccessToken, c as removeRefreshToken, s as saveAccessToken } from "./router-D5H6tH2r.mjs";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const adminSignInApi = (email, password) => publicAxiosInstance.post("/auth/email/sign-in", { email, password });
const reissueAccessTokenApi = (refreshToken) => publicAxiosInstance.post(
  "/admin/auth/reissue",
  {},
  {
    headers: { Authorization: `Bearer ${refreshToken}` }
  }
);
const convertToBearer = (token) => `Bearer ${token}`;
const axiosInstance = axios.create({
  baseURL: void 0,
  withCredentials: true
});
axiosInstance.interceptors.request.use(
  async (config) => {
    const newConfig = { ...config };
    let accessToken = loadAccessToken();
    if (accessToken === null || isTokenExpired(accessToken)) {
      const refreshToken = loadRefreshToken();
      if (refreshToken === null || isTokenExpired(refreshToken)) {
        removeAccessToken();
        removeRefreshToken();
        return config;
      }
      await reissueAccessTokenApi(refreshToken).then((res) => {
        accessToken = res.data.accessToken;
        saveAccessToken(accessToken);
      }).catch((err) => {
        removeAccessToken();
        removeRefreshToken();
        console.error("인증 토큰 갱신중 오류가 발생했습니다", err);
      });
    }
    if (accessToken !== null) {
      newConfig.headers.Authorization = convertToBearer(accessToken);
    }
    return newConfig;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const newError = { ...error };
    if (error.response?.status === 401 || error.response?.status === 403) {
      const refreshToken = loadRefreshToken();
      if (refreshToken === null || isTokenExpired(refreshToken)) {
        removeAccessToken();
        removeRefreshToken();
        throw newError;
      }
      try {
        const newAccessToken = await reissueAccessTokenApi(refreshToken).then((res) => res.data.accessToken);
        saveAccessToken(newAccessToken);
        if (error?.config.headers === void 0) {
          newError.config.headers = {};
        }
        newError.config.headers.Authorization = convertToBearer(newAccessToken);
        return await axios.request(newError.config);
      } catch (err) {
        removeAccessToken();
        removeRefreshToken();
        throw Error("로그인이 필요합니다");
      }
    } else {
      throw newError;
    }
  }
);
const publicAxiosInstance = axios.create({
  baseURL: void 0
});
export {
  Button as B,
  axiosInstance as a,
  adminSignInApi as b,
  cn as c
};
