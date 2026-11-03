// @vitest-environment jsdom
import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import queryClient from "@/lib/react-query/queryClient";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { axiosInstance, getValidAccessToken } from "./axiosInstance";

const { reissueToken } = vi.hoisted(() => ({ reissueToken: vi.fn<() => Promise<string>>() }));
vi.mock("@/apis/Auth/server", () => ({ postReissueToken: reissueToken }));
vi.mock("@/lib/react-query/queryClient", () => ({ default: { removeQueries: vi.fn() } }));

function token(expiration: number) {
  return `header.${btoa(JSON.stringify({ sub: 7, role: "MENTOR", exp: expiration }))}.signature`;
}

beforeEach(() => {
  reissueToken.mockReset();
  useAuthStore.getState().setAccessToken(token(Math.floor(Date.now() / 1000) + 3600));
});

afterEach(() => {
  useAuthStore.getState().clearAccessToken();
});

describe("chat socket and HTTP token rotation", () => {
  it.each([
    "socket-first",
    "http-first",
  ])("shares one refresh and preserves the authenticated identity (%s)", async (order) => {
    let resolveRefresh!: (value: string) => void;
    const pendingRefresh = new Promise<string>((resolve) => {
      resolveRefresh = resolve;
    });
    reissueToken.mockImplementation(async () => {
      const refreshed = await pendingRefresh;
      return refreshed;
    });
    const expiredToken = token(Math.floor(Date.now() / 1000) - 10);
    useAuthStore.setState({ accessToken: expiredToken, refreshStatus: "success", isAuthenticated: true });
    const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => ({
      data: { chatRooms: [] },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    }));

    const socketToken = order === "socket-first" ? getValidAccessToken() : undefined;
    const firstRequest = axiosInstance.get("/chats/rooms", { adapter });
    const secondRequest = axiosInstance.get("/chats/rooms/42/partner", { adapter });
    await Promise.resolve();
    const waitingSocketToken = socketToken ?? getValidAccessToken();
    for (let turn = 0; turn < 5; turn += 1) await Promise.resolve();

    expect(reissueToken).toHaveBeenCalledOnce();
    expect(adapter).not.toHaveBeenCalled();
    expect(useAuthStore.getState()).toMatchObject({
      accessToken: expiredToken,
      isAuthenticated: true,
      refreshStatus: "refreshing",
    });

    const refreshedToken = token(Math.floor(Date.now() / 1000) + 7200);
    resolveRefresh(refreshedToken);
    await expect(waitingSocketToken).resolves.toBe(refreshedToken);
    await Promise.all([firstRequest, secondRequest]);
    expect(adapter).toHaveBeenCalledTimes(2);
    for (const [config] of adapter.mock.calls) {
      expect(config.headers.Authorization).toBe(`Bearer ${refreshedToken}`);
    }
    expect(useAuthStore.getState()).toMatchObject({
      isAuthenticated: true,
      refreshStatus: "success",
      isLoading: false,
    });
  });
});

it("waits for a 401-triggered refresh before returning a nominally valid socket credential", async () => {
  let complete!: () => void;
  const refreshed = token(Math.floor(Date.now() / 1000) + 7200);
  reissueToken.mockImplementation(async () => {
    await new Promise<void>((resolve) => {
      complete = resolve;
    });
    return refreshed;
  });
  const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => {
    if (!config.headers.Authorization?.toString().includes(refreshed)) {
      throw new AxiosError("expired on server", "ERR_BAD_REQUEST", config, undefined, {
        config,
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        data: {},
      });
    }
    return { config, status: 200, statusText: "OK", headers: {}, data: {} };
  });
  const request = axiosInstance.get("/chats/rooms", { adapter });
  await vi.waitFor(() => expect(reissueToken).toHaveBeenCalledOnce());
  let socketResolved = false;
  const socket = getValidAccessToken().then((value) => {
    socketResolved = true;
    return value;
  });
  await Promise.resolve();
  await Promise.resolve();
  const resolvedBeforeRefresh = socketResolved;
  complete();
  const socketCredential = await socket;
  await request;
  expect(resolvedBeforeRefresh).toBe(false);
  expect(socketCredential).toBe(refreshed);
});

it.each([
  undefined,
  503,
])("keeps identity and cache after a transient refresh failure (%s) and retries", async (status) => {
  const expiredToken = token(Math.floor(Date.now() / 1000) - 10);
  useAuthStore.setState({ accessToken: expiredToken, isAuthenticated: true });
  const failure = new AxiosError(
    "temporarily unavailable",
    "ERR_NETWORK",
    undefined,
    undefined,
    status
      ? { config: {} as InternalAxiosRequestConfig, status, statusText: "Unavailable", headers: {}, data: {} }
      : undefined,
  );
  reissueToken.mockRejectedValueOnce(failure);
  vi.mocked(queryClient.removeQueries).mockClear();
  await expect(getValidAccessToken()).rejects.toBe(failure);
  expect(useAuthStore.getState()).toMatchObject({
    accessToken: expiredToken,
    isAuthenticated: true,
    refreshStatus: "retryable",
    isLoading: false,
  });
  expect(queryClient.removeQueries).not.toHaveBeenCalled();
  const renewed = token(Math.floor(Date.now() / 1000) + 7200);
  reissueToken.mockImplementationOnce(async () => {
    return renewed;
  });
  await expect(getValidAccessToken()).resolves.toBe(renewed);
});

it("retries refresh rather than reusing a server-rejected token after a 503", async () => {
  const oldToken = useAuthStore.getState().accessToken;
  const failure = new AxiosError("Unavailable", "ERR_BAD_RESPONSE", undefined, undefined, {
    config: {} as InternalAxiosRequestConfig,
    status: 503,
    statusText: "Unavailable",
    headers: {},
    data: {},
  });
  reissueToken.mockRejectedValueOnce(failure);
  const adapter = async (config: InternalAxiosRequestConfig) => {
    throw new AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, undefined, {
      config,
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      data: {},
    });
  };
  await expect(axiosInstance.get("/chats/rooms", { adapter })).rejects.toBe(failure);
  expect(useAuthStore.getState()).toMatchObject({
    accessToken: oldToken,
    isAuthenticated: true,
    refreshStatus: "retryable",
  });
  const renewed = token(Math.floor(Date.now() / 1000) + 7200);
  reissueToken.mockImplementationOnce(async () => {
    return renewed;
  });
  await expect(getValidAccessToken()).resolves.toBe(renewed);
  expect(reissueToken).toHaveBeenCalledTimes(2);
});

it.each([401, 403])("clears identity and chat cache on refresh denial (%s)", async (status) => {
  useAuthStore.setState({ accessToken: token(Math.floor(Date.now() / 1000) - 10) });
  reissueToken.mockRejectedValueOnce(
    new AxiosError("Denied", "ERR_BAD_REQUEST", undefined, undefined, {
      config: {} as InternalAxiosRequestConfig,
      status,
      statusText: "Denied",
      headers: {},
      data: {},
    }),
  );
  vi.mocked(queryClient.removeQueries).mockClear();
  await expect(getValidAccessToken()).resolves.toBeNull();
  expect(useAuthStore.getState()).toMatchObject({ accessToken: null, isAuthenticated: false, refreshStatus: "failed" });
  expect(queryClient.removeQueries).toHaveBeenCalledWith({ queryKey: ["chat"] });
});
