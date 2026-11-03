// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react/pure";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ChatHistoriesResponse } from "@/apis/chat";
import { chatKeys } from "@/apis/chat/queryKeys";
import useAuthStore from "@/lib/zustand/useAuthStore";
import type { ChatTransportEvents } from "./types";
import { useChatSession } from "./useChatSession";

const { loadHistory, markRead, uploadImages, events, transports } = vi.hoisted(() => ({
  loadHistory: vi.fn<() => Promise<ChatHistoriesResponse>>(),
  markRead: vi.fn<() => Promise<void>>(),
  uploadImages: vi.fn<() => Promise<string[]>>(),
  events: [] as ChatTransportEvents[],
  transports: [] as {
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    publish: ReturnType<typeof vi.fn>;
  }[],
}));

vi.mock("@/apis/chat", async () => ({
  chatApi: { getChatHistories: loadHistory, putReadChatRoom: markRead },
  ...(await import("@/apis/chat/queryKeys")),
  ...(await import("@/apis/chat/auth")),
}));
vi.mock("@/apis/image-upload/api", () => ({ imageUploadApi: { postUploadChatImages: uploadImages } }));
vi.mock("@/utils/axiosInstance", () => ({ getValidAccessToken: vi.fn(async () => "token") }));
vi.mock("./stompTransport", () => ({
  createStompTransport: (callbacks: ChatTransportEvents) => {
    const transport = { start: vi.fn(), stop: vi.fn(), publish: vi.fn(), reconnect: vi.fn() };
    events.push(callbacks);
    transports.push(transport);
    return transport;
  },
}));

function setup(strict = false) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  function render(roomId: number, userId = 7, enabled = true) {
    return renderHook((props) => useChatSession(props.roomId, props.userId, props.enabled), {
      initialProps: { roomId, userId, enabled },
      wrapper: Wrapper,
      reactStrictMode: strict,
    });
  }
  return { queryClient, render };
}

beforeEach(() => {
  const tokenPayload = btoa(JSON.stringify({ sub: 7, role: "MENTOR", exp: Math.floor(Date.now() / 1000) + 3600 }));
  useAuthStore.getState().setAccessToken(`header.${tokenPayload}.signature`);
  events.splice(0);
  transports.splice(0);
  loadHistory.mockReset().mockResolvedValue({ content: [], nextPageNumber: -1 });
  markRead.mockReset().mockResolvedValue(undefined);
  uploadImages.mockReset().mockResolvedValue([]);
});

afterEach(() => {
  useAuthStore.getState().clearAccessToken();
});

describe("useChatSession boundaries", () => {
  it("waits for authentication gating and stops when the gate closes", async () => {
    const { render } = setup();
    const hook = render(42, 7, false);
    expect(loadHistory).not.toHaveBeenCalled();
    expect(transports).toHaveLength(0);

    hook.rerender({ roomId: 42, userId: 7, enabled: true });
    await waitFor(() => expect(hook.result.current.snapshot.historyStatus).toBe("ready"));
    expect(loadHistory).toHaveBeenCalledOnce();
    expect(transports[0].start).toHaveBeenCalledOnce();
    hook.rerender({ roomId: 42, userId: 7, enabled: false });
    expect(transports[0].stop).toHaveBeenCalledOnce();
    expect(hook.result.current.snapshot.connection).toBe("disconnected");
  });

  it("survives React StrictMode's effect replay and ignores the disposed connection", async () => {
    const { render } = setup(true);
    const hook = render(42);
    await waitFor(() => expect(hook.result.current.snapshot.historyStatus).toBe("ready"));
    expect(transports).toHaveLength(2);
    expect(transports[0].stop).toHaveBeenCalledOnce();
    expect(transports[1].start).toHaveBeenCalledOnce();

    act(() => {
      events[0].onConnection("error");
      events[0].onMessage({
        id: 1,
        content: "늦은 이벤트",
        senderId: 8,
        createdAt: "2026-10-27T00:00:00Z",
        attachments: [],
      });
      events[1].onConnection("connected");
      events[1].onMessage({
        id: 2,
        content: "현재 이벤트",
        senderId: 8,
        createdAt: "2026-10-27T00:00:01Z",
        attachments: [],
      });
    });
    expect(hook.result.current.snapshot.messages.map((message) => message.id)).toEqual([2]);
    expect(hook.result.current.snapshot.connection).toBe("connected");
  });

  it("restores unconfirmed original content on room revisit and isolates it by room and user", async () => {
    const { queryClient, render } = setup();
    const first = render(42);
    await waitFor(() => expect(first.result.current.snapshot.historyStatus).toBe("ready"));
    act(() => events[0].onConnection("connected"));
    await act(async () => {
      await expect(first.result.current.sendText("전송 원문")).resolves.toBe(true);
    });
    expect(first.result.current.snapshot.outgoing).toHaveLength(1);
    first.unmount();

    const revisited = render(42);
    expect(revisited.result.current.snapshot.outgoing).toHaveLength(1);
    expect(revisited.result.current.snapshot.outgoing[0]).toMatchObject({
      content: "전송 원문",
      status: "unconfirmed",
    });
    expect(queryClient.getQueryData(chatKeys.outbox(7, 42))).toEqual(revisited.result.current.snapshot.outgoing);
    const anotherRoom = render(43);
    const anotherUser = render(42, 8);
    expect(anotherRoom.result.current.snapshot.outgoing).toEqual([]);
    expect(anotherUser.result.current.snapshot.outgoing).toEqual([]);
    revisited.unmount();
    anotherRoom.unmount();
    anotherUser.unmount();
    queryClient.clear();
  });

  it("does not recreate private outbox data when cleanup runs after logout clears the cache", async () => {
    const { queryClient, render } = setup();
    const hook = render(42);
    await waitFor(() => expect(hook.result.current.snapshot.historyStatus).toBe("ready"));
    act(() => events[0].onConnection("connected"));
    await act(async () => {
      await hook.result.current.sendText("로그아웃 시 제거할 원문");
    });
    expect(queryClient.getQueryData(chatKeys.outbox(7, 42))).toHaveLength(1);

    act(() => {
      useAuthStore.getState().clearAccessToken();
      queryClient.removeQueries({ queryKey: chatKeys.all });
    });
    hook.rerender({ roomId: 42, userId: 7, enabled: false });
    hook.unmount();
    expect(queryClient.getQueryData(chatKeys.outbox(7, 42))).toBeUndefined();
    queryClient.clear();
  });
});
