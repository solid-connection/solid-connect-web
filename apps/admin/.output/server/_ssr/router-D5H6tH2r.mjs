import { D as redirect } from "../_chunks/_libs/@tanstack/router-core.mjs";
import { c as createRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, H as HeadContent, S as Scripts } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import "../_libs/cookie-es.mjs";
import "../_chunks/_libs/@tanstack/history.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/tiny-warning.mjs";
import "../_chunks/_libs/react-dom.mjs";
import "../_chunks/_libs/asynckit.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
function AdminLayout({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "p-6", children }) });
}
const appCss = "/assets/styles-BHpgolea.css";
const Route$3 = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "Solid Connection Admin"
      }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootDocument
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "ko", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
const Route$2 = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/scores" });
  }
});
const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1e3);
    const { exp } = payload;
    return exp < currentTime;
  } catch (error) {
    console.error("인증 토큰에 문제가 있습니다:", error);
    return true;
  }
};
const loadRefreshToken = () => {
  try {
    return localStorage.getItem("refreshToken");
  } catch (err) {
    console.error("Could not load refresh token", err);
    return null;
  }
};
const saveRefreshToken = (token) => {
  try {
    localStorage.setItem("refreshToken", token);
  } catch (err) {
    console.error("Could not save refresh token", err);
  }
};
const removeRefreshToken = () => {
  try {
    localStorage.removeItem("refreshToken");
  } catch (err) {
    console.error("Could not remove refresh token", err);
  }
};
const loadAccessToken = () => {
  try {
    return localStorage.getItem("accessToken");
  } catch (err) {
    console.error("Could not load access token", err);
    return null;
  }
};
const saveAccessToken = (token) => {
  try {
    localStorage.setItem("accessToken", token);
  } catch (err) {
    console.error("Could not save access token", err);
  }
};
const removeAccessToken = () => {
  try {
    localStorage.removeItem("accessToken");
  } catch (err) {
    console.error("Could not remove access token", err);
  }
};
const $$splitComponentImporter$1 = () => import("./index-DAUxcj3S.mjs");
const Route$1 = createFileRoute("/scores/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const token = loadAccessToken();
      if (!token || isTokenExpired(token)) {
        throw redirect({
          to: "/auth/login"
        });
      }
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./login-CbYW89Za.mjs");
const Route = createFileRoute("/auth/login")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$3
});
const ScoresIndexRoute = Route$1.update({
  id: "/scores/",
  path: "/scores/",
  getParentRoute: () => Route$3
});
const AuthLoginRoute = Route.update({
  id: "/auth/login",
  path: "/auth/login",
  getParentRoute: () => Route$3
});
const rootRouteChildren = {
  IndexRoute,
  AuthLoginRoute,
  ScoresIndexRoute
};
const routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  saveRefreshToken as a,
  loadRefreshToken as b,
  removeRefreshToken as c,
  router as d,
  isTokenExpired as i,
  loadAccessToken as l,
  removeAccessToken as r,
  saveAccessToken as s
};
