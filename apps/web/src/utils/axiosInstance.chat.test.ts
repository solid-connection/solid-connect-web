// @vitest-environment jsdom
import type { InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
      useAuthStore.getState().setAccessToken(refreshed);
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
