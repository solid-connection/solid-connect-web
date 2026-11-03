// @vitest-environment jsdom
import { act, fireEvent, render, screen } from "@testing-library/react/pure";
import { type ReactNode, useEffect, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useAuthStore from "@/lib/zustand/useAuthStore";
import ChatAccess from "./ChatAccess";

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
  onMount.mockClear();
  onUnmount.mockClear();
  useAuthStore.getState().setAccessToken(token());
});

afterEach(() => {
  useAuthStore.getState().clearAccessToken();
});

describe("ChatAccess identity continuity", () => {
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
