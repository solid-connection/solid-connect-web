// @vitest-environment jsdom
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react/pure";
import { type ReactNode, useEffect, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { getValidAccessToken } from "@/utils/axiosInstance";
import ChatAccess from "./ChatAccess";

vi.mock("@/utils/axiosInstance", () => ({ getValidAccessToken: vi.fn() }));

vi.mock("@/apis/chat", async () => await import("@/apis/chat/auth"));
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

const onMount = vi.fn();
const onUnmount = vi.fn();

function token(userId = 7, expiration = Math.floor(Date.now() / 1000) + 3600) {
  return `header.${btoa(JSON.stringify({ sub: userId, role: "MENTOR", exp: expiration }))}.signature`;
}

function Draft({ userId }: { userId: number }) {
  const [value, setValue] = useState("");
  useEffect(() => {
    onMount();
    return () => {
      onUnmount();
    };
  }, []);
  return <input aria-label={`메시지 ${userId}`} value={value} onChange={(event) => setValue(event.target.value)} />;
}

function renderDraft() {
  return render(<ChatAccess>{(userId) => <Draft userId={userId} />}</ChatAccess>);
}

beforeEach(() => {
  vi.mocked(getValidAccessToken).mockReset().mockResolvedValue(null);
  onMount.mockClear();
  onUnmount.mockClear();
  useAuthStore.getState().setAccessToken(token());
});

afterEach(() => {
  useAuthStore.getState().clearAccessToken();
});

describe("ChatAccess identity continuity", () => {
  it("refreshes an expired identity on first entry before showing the login gate", async () => {
    useAuthStore.getState().setAccessToken(token(7, Math.floor(Date.now() / 1000) - 1));
    let finish!: (token: string) => void;
    vi.mocked(getValidAccessToken).mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    renderDraft();
    await waitFor(() => expect(getValidAccessToken).toHaveBeenCalledOnce());
    expect(screen.queryByRole("link", { name: "로그인하기" })).toBeNull();
    expect(screen.getByRole("status")).toBeTruthy();
    await act(async () => {
      const refreshed = token();
      useAuthStore.getState().setRefreshedAccessToken(refreshed, useAuthStore.getState().sessionVersion);
      finish(refreshed);
    });
    expect(screen.getByRole("textbox", { name: "메시지 7" })).toBeTruthy();
  });

  it("offers explicit retry after a transient refresh failure on first entry", async () => {
    useAuthStore.getState().setAccessToken(token(7, Math.floor(Date.now() / 1000) - 1));
    vi.mocked(getValidAccessToken).mockImplementationOnce(async () => {
      useAuthStore.getState().setRefreshStatus("retryable");
      throw new Error("temporary failure");
    });
    renderDraft();
    const retry = await screen.findByRole("button", { name: "다시 확인" });
    expect(getValidAccessToken).toHaveBeenCalledOnce();
    expect(screen.queryByRole("link", { name: "로그인하기" })).toBeNull();
    vi.mocked(getValidAccessToken).mockImplementationOnce(async () => {
      const refreshed = token();
      useAuthStore.getState().setRefreshedAccessToken(refreshed, useAuthStore.getState().sessionVersion);
      return refreshed;
    });
    fireEvent.click(retry);
    await screen.findByRole("textbox", { name: "메시지 7" });
    expect(getValidAccessToken).toHaveBeenCalledTimes(2);
  });

  it("does not reuse a remembered identity from another authenticated session", () => {
    renderDraft();
    act(() => useAuthStore.getState().setAccessToken(token(8, Math.floor(Date.now() / 1000) - 1)));
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.getByRole("status")).toBeTruthy();
    expect(getValidAccessToken).toHaveBeenCalledOnce();
  });

  it("preserves the draft after token expiry before refresh starts", () => {
    renderDraft();
    const input = screen.getByRole("textbox", { name: "메시지 7" }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "만료 직전 작성한 원문" } });
    act(() =>
      useAuthStore.setState({
        accessToken: token(7, Math.floor(Date.now() / 1000) - 1),
        refreshStatus: "success",
      }),
    );
    expect(screen.getByRole("textbox", { name: "메시지 7" })).toBe(input);
    expect(input.value).toBe("만료 직전 작성한 원문");
    expect(onUnmount).not.toHaveBeenCalled();
  });

  it("preserves the mounted composer and its draft while an expired token is refreshed", () => {
    renderDraft();
    const input = screen.getByRole("textbox", { name: "메시지 7" }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "아직 보내지 않은 원문" } });
    act(() => {
      useAuthStore.setState({
        accessToken: token(7, Math.floor(Date.now() / 1000) - 1),
        refreshStatus: "refreshing",
        isLoading: true,
      });
    });

    expect(screen.getByRole("textbox", { name: "메시지 7" })).toBe(input);
    expect(input.value).toBe("아직 보내지 않은 원문");
    expect(onMount).toHaveBeenCalledOnce();
    expect(onUnmount).not.toHaveBeenCalled();

    act(() => useAuthStore.getState().setAccessToken(token()));
    expect(screen.getByRole("textbox", { name: "메시지 7" })).toBe(input);
    expect(input.value).toBe("아직 보내지 않은 원문");
    expect(onMount).toHaveBeenCalledOnce();
  });

  it("unmounts the composer immediately when refresh fails and clears authentication", () => {
    renderDraft();
    act(() => {
      useAuthStore.setState({
        accessToken: token(7, Math.floor(Date.now() / 1000) - 1),
        refreshStatus: "refreshing",
        isLoading: true,
      });
    });
    expect(screen.getByRole("textbox")).toBeTruthy();

    act(() => {
      useAuthStore.getState().clearAccessToken();
      useAuthStore.getState().setRefreshStatus("failed");
    });
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(onUnmount).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "로그인하기" }).getAttribute("href")).toBe("/login");
  });

  it("does not reuse the previous identity after logout during token refresh", () => {
    renderDraft();
    act(() => {
      useAuthStore.setState({
        accessToken: token(7, Math.floor(Date.now() / 1000) - 1),
        refreshStatus: "refreshing",
        isLoading: true,
      });
    });
    act(() => useAuthStore.getState().clearAccessToken());
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(onUnmount).toHaveBeenCalledOnce();

    act(() => useAuthStore.setState({ refreshStatus: "refreshing", isLoading: true }));
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.getByRole("status").textContent).toBe("로그인 정보를 확인하고 있어요.");
  });
});
