// @vitest-environment jsdom
import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import queryClient from "@/lib/react-query/queryClient";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { AuthenticationChangedError, axiosInstance, getValidAccessToken, publicAxiosInstance } from "./axiosInstance";

vi.mock("@/lib/react-query/queryClient", () => ({ default: { removeQueries: vi.fn() } }));
const originalAdapter = publicAxiosInstance.defaults.adapter;
function token(user: number, expired = false) {
  return `header.${btoa(JSON.stringify({ sub: user, role: "MENTOR", exp: Math.floor(Date.now() / 1000) + (expired ? -10 : 3600) }))}.signature`;
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((accept, deny) => {
    resolve = accept;
    reject = deny;
  });
  return { promise, resolve, reject };
}
beforeEach(() => {
  useAuthStore.getState().setAccessToken(token(7, true));
  vi.mocked(queryClient.removeQueries).mockClear();
});
afterEach(() => {
  publicAxiosInstance.defaults.adapter = originalAdapter;
  useAuthStore.getState().clearAccessToken();
});

it.each(["logout", "other-account"])("does not commit a late refresh token after %s", async (change) => {
  const response = deferred<string>();
  publicAxiosInstance.defaults.adapter = async (config) => ({
    config,
    status: 200,
    statusText: "OK",
    headers: {},
    data: { accessToken: await response.promise },
  });
  const pending = getValidAccessToken();
  // Attach the rejection handler before resolving the network response.
  const rejected = expect(pending).rejects.toBeInstanceOf(AuthenticationChangedError);
  await vi.waitFor(() => expect(useAuthStore.getState().refreshStatus).toBe("refreshing"));
  if (change === "logout") useAuthStore.getState().clearAccessToken();
  else useAuthStore.getState().setAccessToken(token(8));
  const expected = useAuthStore.getState();
  response.resolve(token(7));
  await rejected;
  expect(useAuthStore.getState()).toBe(expected);
  expect(queryClient.removeQueries).not.toHaveBeenCalled();
});

it.each([401, 403, 503])("does not clear a newer account after old refresh error %s", async (status) => {
  const response = deferred<void>();
  publicAxiosInstance.defaults.adapter = async (config) => {
    await response.promise;
    throw new AxiosError("Refresh failed", "ERR_BAD_RESPONSE", config, undefined, {
      config,
      status,
      statusText: "Failed",
      headers: {},
      data: {},
    });
  };
  const pending = getValidAccessToken();
  const rejected = expect(pending).rejects.toBeInstanceOf(AuthenticationChangedError);
  await vi.waitFor(() => expect(useAuthStore.getState().refreshStatus).toBe("refreshing"));
  useAuthStore.getState().setAccessToken(token(8));
  const expected = useAuthStore.getState();
  response.resolve();
  await rejected;
  expect(useAuthStore.getState()).toBe(expected);
  expect(queryClient.removeQueries).not.toHaveBeenCalled();
});

it("never sends an older user's waiting HTTP request with a new user's token", async () => {
  const response = deferred<string>();
  publicAxiosInstance.defaults.adapter = async (config) => ({
    config,
    status: 200,
    statusText: "OK",
    headers: {},
    data: { accessToken: await response.promise },
  });
  const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => ({
    config,
    status: 200,
    statusText: "OK",
    headers: {},
    data: {},
  }));
  const request = axiosInstance.get("/chats/rooms", { adapter });
  const rejected = expect(request).rejects.toBeInstanceOf(AuthenticationChangedError);
  await vi.waitFor(() => expect(useAuthStore.getState().refreshStatus).toBe("refreshing"));
  useAuthStore.getState().setAccessToken(token(8));
  response.resolve(token(7));
  await rejected;
  expect(adapter).not.toHaveBeenCalled();
});
