import { afterEach, describe, expect, it, vi } from "vitest";
import type { ChatHistoriesResponse } from "@/apis/chat";
import type { ChatMessage } from "@/types/chat";
import { ChatSession } from "./ChatSession";
import type { ChatTransportEvents, OutgoingMessage } from "./types";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

const message = (id: number, content = `메시지 ${id}`, senderId = 7): ChatMessage => ({
  id,
  content,
  senderId,
  createdAt: new Date(Date.UTC(2026, 9, 27, 0, 0, Math.abs(id))).toISOString(),
  attachments: [],
});

const history = (content: ChatMessage[], nextPageNumber = -1): ChatHistoriesResponse => ({ content, nextPageNumber });

async function settle() {
  for (let turn = 0; turn < 20; turn += 1) await Promise.resolve();
}

const sessions: ChatSession[] = [];

function createSession(initialOutgoing: OutgoingMessage[] = []) {
  const events: ChatTransportEvents[] = [];
  const transports: {
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    reconnect: ReturnType<typeof vi.fn>;
    publish: ReturnType<typeof vi.fn>;
  }[] = [];
  const loadHistory = vi
    .fn<(page: number, signal: AbortSignal) => Promise<ChatHistoriesResponse>>()
    .mockResolvedValue(history([]));
  const markRead = vi.fn<(signal: AbortSignal) => Promise<void>>().mockResolvedValue(undefined);
  const saveOutgoing = vi.fn<(outgoing: OutgoingMessage[]) => void>();
  const onMessagesChanged = vi.fn();
  const onRead = vi.fn();
  const session = new ChatSession({
    userId: 7,
    loadHistory,
    markRead,
    saveOutgoing,
    onMessagesChanged,
    onRead,
    initialOutgoing,
    createTransport: (callbacks) => {
      const transport = { start: vi.fn(), stop: vi.fn(), reconnect: vi.fn(), publish: vi.fn() };
      events.push(callbacks);
      transports.push(transport);
      return transport;
    },
  });
  sessions.push(session);
  return { session, events, transports, loadHistory, markRead, saveOutgoing, onMessagesChanged, onRead };
}

afterEach(() => {
  for (const session of sessions.splice(0)) session.stop();
});

describe("ChatSession history and connection lifecycle", () => {
  it("keeps a live message received before the initial HTTP snapshot resolves", async () => {
    const pending = deferred<ChatHistoriesResponse>();
    const { session, events, loadHistory } = createSession();
    loadHistory.mockReturnValueOnce(pending.promise);
    session.start();
    events[0].onMessage(message(2));
    pending.resolve(history([message(1)]));
    await settle();

    expect(session.getSnapshot().messages.map((item) => item.id)).toEqual([1, 2]);
    expect(session.getSnapshot().historyStatus).toBe("ready");
  });

  it("recovers the older-history cursor after an initial HTTP failure with live messages present", async () => {
    const pending = deferred<ChatHistoriesResponse>();
    const { session, events, loadHistory } = createSession();
    loadHistory.mockReturnValueOnce(pending.promise);
    session.start();
    events[0].onMessage(message(3));
    pending.reject(new Error("temporary network failure"));
    await settle();
    expect(session.getSnapshot().syncError).not.toBeNull();
    loadHistory.mockResolvedValueOnce(history([message(3), message(2)], 2));

    await session.syncLatest();
    expect(session.getSnapshot().hasMore).toBe(true);
    loadHistory.mockResolvedValueOnce(history([message(1)], -1));
    await session.loadOlder();
    expect(loadHistory.mock.calls.at(-1)?.[0]).toBe(2);
    expect(session.getSnapshot().messages.map((item) => item.id)).toEqual([1, 2, 3]);
  });

  it("follows reconnect pages until an already observed server message closes the gap", async () => {
    const { session, events, loadHistory } = createSession();
    loadHistory.mockResolvedValueOnce(history([message(10), message(9)], 2));
    session.start();
    await settle();
    loadHistory.mockClear();
    loadHistory.mockImplementation(async (page) => {
      const pages = new Map([
        [1, history([message(16), message(15)], 2)],
        [2, history([message(14), message(13)], 3)],
        [3, history([message(12), message(11)], 4)],
        [4, history([message(10), message(9)], 5)],
      ]);
      const result = pages.get(page);
      if (!result) throw new Error(`Unexpected page ${page}`);
      return result;
    });

    events[0].onConnected();
    await settle();

    expect(loadHistory.mock.calls.map(([page]) => page)).toEqual([1, 2, 3, 4]);
    expect(session.getSnapshot().messages.map((item) => item.id)).toEqual([9, 10, 11, 12, 13, 14, 15, 16]);
  });

  it("recovers every reconnect page after the room was initially empty", async () => {
    const { session, loadHistory } = createSession();
    session.start();
    await settle();
    expect(session.getSnapshot().messages).toEqual([]);
    expect(session.getSnapshot().hasMore).toBe(false);
    loadHistory.mockClear();
    const allMessages = Array.from({ length: 45 }, (_, index) => message(45 - index));
    loadHistory.mockImplementation(async (page) => {
      const offset = (page - 1) * 20;
      return history(allMessages.slice(offset, offset + 20), page < 3 ? page + 1 : -1);
    });

    await session.syncLatest();

    expect(loadHistory.mock.calls.map(([page]) => page)).toEqual([1, 2, 3]);
    expect(session.getSnapshot().messages.map((item) => item.id)).toEqual(
      Array.from({ length: 45 }, (_, index) => index + 1),
    );
    expect(session.getSnapshot().hasMore).toBe(false);
  });

  it("continues older history after catch-up pages even if an earlier older request finishes late", async () => {
    const { session, loadHistory } = createSession();
    loadHistory.mockResolvedValueOnce(history([message(10), message(9)], 2));
    session.start();
    await settle();
    const pendingOlder = deferred<ChatHistoriesResponse>();
    loadHistory.mockReturnValueOnce(pendingOlder.promise);
    const loadingOlder = session.loadOlder();
    loadHistory.mockImplementation(async (page) => {
      const pages = new Map([
        [1, history([message(16), message(15)], 2)],
        [2, history([message(14), message(13)], 3)],
        [3, history([message(12), message(11)], 4)],
        [4, history([message(10), message(9)], 5)],
        [5, history([message(8), message(7)], 6)],
        [6, history([message(6), message(5)], 7)],
      ]);
      const result = pages.get(page);
      if (!result) throw new Error(`Unexpected page ${page}`);
      return result;
    });

    await session.syncLatest();
    pendingOlder.resolve(history([message(8), message(7)], 3));
    await loadingOlder;
    loadHistory.mockClear();
    await session.loadOlder();

    expect(loadHistory.mock.calls.map(([page]) => page)).toEqual([5, 6]);
    expect(session.getSnapshot().hasMore).toBe(true);
    expect(session.getSnapshot().messages.map((item) => item.id)).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  });

  it("keeps older history exhausted after reconnect when all old messages were already loaded", async () => {
    const { session, loadHistory } = createSession();
    loadHistory
      .mockResolvedValueOnce(history([message(4), message(3)], 2))
      .mockResolvedValueOnce(history([message(2), message(1)], -1));
    session.start();
    await settle();
    await session.loadOlder();
    expect(session.getSnapshot().hasMore).toBe(false);
    loadHistory.mockImplementation(async (page) => {
      if (page === 1) return history([message(8), message(7)], 2);
      if (page === 2) return history([message(6), message(5)], 3);
      return history([message(4), message(3)], 4);
    });

    await session.syncLatest();
    expect(session.getSnapshot().hasMore).toBe(false);
    expect(session.getSnapshot().messages.map((item) => item.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    loadHistory.mockClear();
    await session.loadOlder();
    expect(loadHistory).not.toHaveBeenCalled();
  });

  it("closes the pre-subscription gap even when a newer live frame is already in the snapshot", async () => {
    const initialRequest = deferred<ChatHistoriesResponse>();
    const { session, events, loadHistory } = createSession();
    loadHistory.mockReturnValueOnce(initialRequest.promise);
    loadHistory.mockImplementation(async (page) => {
      if (page === 1) return history([message(6), message(5)], 2);
      if (page === 2) return history([message(4), message(3)], 3);
      return history([message(2), message(1)], -1);
    });
    session.start();
    events[0].onConnected();
    events[0].onMessage(message(6));
    initialRequest.resolve(history([message(2), message(1)], 2));
    await settle();

    expect(session.getSnapshot().messages.map((item) => item.id)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(loadHistory.mock.calls.map(([page]) => page)).toEqual([1, 1, 2, 3]);
  });

  it("ignores an aborted initial request and the old socket after start-stop-start", async () => {
    const oldRequest = deferred<ChatHistoriesResponse>();
    const { session, events, loadHistory, transports } = createSession();
    loadHistory.mockReturnValueOnce(oldRequest.promise).mockResolvedValueOnce(history([message(2)]));
    session.start();
    const oldSignal = loadHistory.mock.calls[0][1];
    session.stop();
    session.start();
    await settle();

    oldRequest.resolve(history([message(1)]));
    events[0].onMessage(message(3));
    events[0].onConnection("error");
    events[1].onConnection("connected");
    await settle();

    expect(oldSignal.aborted).toBe(true);
    expect(transports[0].stop).toHaveBeenCalledOnce();
    expect(transports[1].start).toHaveBeenCalledOnce();
    expect(session.getSnapshot().messages.map((item) => item.id)).toEqual([2]);
    expect(session.getSnapshot().connection).toBe("connected");
  });
});

describe("ChatSession outgoing messages", () => {
  it("keeps an unconfirmed restored send when a later identical send is echoed after history", async () => {
    const original = createSession();
    original.session.start();
    await settle();
    original.events[0].onConnection("connected");
    original.session.publish({ content: "같은 내용", senderId: 7 });
    const saved = original.session.getSnapshot().outgoing;
    original.session.stop();

    const { session, events, loadHistory } = createSession(saved);
    session.start();
    await settle();
    events[0].onConnection("connected");
    session.publish({ content: "같은 내용", senderId: 7 });
    loadHistory.mockResolvedValue(history([message(1, "같은 내용")]));
    await session.syncLatest();
    events[0].onMessage(message(1, "같은 내용"));
    expect(session.getSnapshot().outgoing).toEqual([{ ...saved[0], status: "unconfirmed" }]);
    events[0].onMessage(message(1, "같은 내용"));
    expect(session.getSnapshot().outgoing).toHaveLength(1);
  });

  it("confirms the first socket echo even when history already contains the delivery", async () => {
    const { session, events, loadHistory } = createSession();
    session.start();
    await settle();
    events[0].onConnection("connected");
    session.publish({ content: "먼저 기록에 도착", senderId: 7 });
    loadHistory.mockResolvedValue(history([message(1, "먼저 기록에 도착")]));
    await session.syncLatest();
    expect(session.getSnapshot().outgoing).toHaveLength(1);
    session.publish({ content: "먼저 기록에 도착", senderId: 7 });

    events[0].onMessage(message(1, "먼저 기록에 도착"));
    expect(session.getSnapshot().outgoing).toHaveLength(1);
    events[0].onMessage(message(1, "먼저 기록에 도착"));
    expect(session.getSnapshot().outgoing).toHaveLength(1);
    events[0].onMessage(message(2, "먼저 기록에 도착"));
    expect(session.getSnapshot().outgoing).toEqual([]);
  });

  it("does not confirm a new send with an echo already present before publish", async () => {
    const { session, events, loadHistory } = createSession();
    loadHistory.mockResolvedValue(history([message(1, "같은 내용")]));
    session.start();
    await settle();
    events[0].onConnection("connected");
    session.publish({ content: "같은 내용", senderId: 7 });
    events[0].onMessage(message(1, "같은 내용"));
    expect(session.getSnapshot().outgoing).toHaveLength(1);
    events[0].onMessage(message(2, "같은 내용"));
    expect(session.getSnapshot().outgoing).toEqual([]);
  });

  it("consumes one identical outgoing message per new self echo and ignores duplicate frames", async () => {
    const { session, events } = createSession();
    session.start();
    await settle();
    events[0].onConnection("connected");
    expect(session.publish({ content: "같은 내용", senderId: 7 })).toBe(true);
    expect(session.publish({ content: "같은 내용", senderId: 7 })).toBe(true);
    const secondClientId = session.getSnapshot().outgoing[1].clientId;

    events[0].onMessage(message(1, "같은 내용"));
    expect(session.getSnapshot().outgoing.map((item) => item.clientId)).toEqual([secondClientId]);
    events[0].onMessage(message(1, "같은 내용"));
    expect(session.getSnapshot().outgoing.map((item) => item.clientId)).toEqual([secondClientId]);
    events[0].onMessage(message(2, "같은 내용", 9));
    expect(session.getSnapshot().outgoing).toHaveLength(1);
    events[0].onMessage(message(3, "같은 내용"));
    expect(session.getSnapshot().outgoing).toEqual([]);
  });

  it("keeps sends unconfirmed when an echo has no server ID and never automatically republishes", async () => {
    vi.useFakeTimers();
    const { session, events, transports } = createSession();
    session.start();
    await settle();
    events[0].onConnection("connected");
    session.publish({ content: "확인 필요", senderId: 7 });
    events[0].onMessage(message(-1, "확인 필요"));
    expect(session.getSnapshot().outgoing).toHaveLength(1);

    await vi.advanceTimersByTimeAsync(15000);
    expect(session.getSnapshot().outgoing[0].status).toBe("unconfirmed");
    expect(transports[0].publish).toHaveBeenCalledOnce();
  });

  it("returns false on publish failure and removes only that attempted outgoing item", async () => {
    const { session, events, transports } = createSession();
    session.start();
    await settle();
    events[0].onConnection("connected");
    session.publish({ content: "먼저 전송", senderId: 7 });
    const previous = session.getSnapshot().outgoing;
    transports[0].publish.mockImplementationOnce(() => {
      throw new Error("socket closed");
    });

    expect(session.publish({ content: "입력 유지", senderId: 7 })).toBe(false);
    expect(session.getSnapshot().outgoing).toEqual(previous);
  });

  it("restores a saved outgoing item as unconfirmed and blocks late uploads after stop", async () => {
    const { session, events, saveOutgoing, transports } = createSession();
    session.start();
    await settle();
    events[0].onConnection("connected");
    session.publish({ content: "보관할 원문", senderId: 7 });
    const upload = deferred<string[]>();
    const uploadFn = vi.fn().mockReturnValue(upload.promise);
    const sending = session.sendImages([new File(["image"], "photo.png", { type: "image/png" })], uploadFn);
    session.stop();
    upload.resolve(["https://cdn.example.com/photo.png"]);

    await expect(sending).resolves.toBe(false);
    expect(transports[0].publish).toHaveBeenCalledOnce();
    expect(uploadFn.mock.calls[0][1].aborted).toBe(true);
    const saved = saveOutgoing.mock.calls.at(-1)?.[0] ?? [];
    const restored = createSession(saved).session.getSnapshot().outgoing;
    expect(restored).toHaveLength(1);
    expect(restored[0]).toMatchObject({ content: "보관할 원문", status: "unconfirmed" });
  });
});

describe("ChatSession read batching", () => {
  it("coalesces messages, pauses while hidden and follows messages received during a read", async () => {
    vi.useFakeTimers();
    const pendingRead = deferred<void>();
    const { session, events, markRead, onRead } = createSession();
    markRead.mockReturnValueOnce(pendingRead.promise);
    session.start();
    await settle();
    events[0].onMessage(message(1));
    await vi.advanceTimersByTimeAsync(1000);
    expect(markRead).not.toHaveBeenCalled();

    session.setReading(true);
    events[0].onMessage(message(2));
    events[0].onMessage(message(3));
    await vi.advanceTimersByTimeAsync(300);
    expect(markRead).toHaveBeenCalledOnce();
    events[0].onMessage(message(4));
    pendingRead.resolve();
    await settle();
    await vi.advanceTimersByTimeAsync(300);
    expect(markRead).toHaveBeenCalledTimes(2);
    expect(onRead).toHaveBeenCalledTimes(2);

    session.setReading(false);
    events[0].onMessage(message(5));
    await vi.advanceTimersByTimeAsync(1000);
    expect(markRead).toHaveBeenCalledTimes(2);
    session.setReading(true);
    await vi.advanceTimersByTimeAsync(300);
    expect(markRead).toHaveBeenCalledTimes(3);
  });

  it("does not notify or mutate the snapshot when a stopped read finishes late", async () => {
    vi.useFakeTimers();
    const pendingRead = deferred<void>();
    const { session, markRead, onRead } = createSession();
    markRead.mockReturnValueOnce(pendingRead.promise);
    session.start();
    await settle();
    session.setReading(true);
    await vi.advanceTimersByTimeAsync(300);
    const signal = markRead.mock.calls[0][0];
    session.stop();
    const stoppedSnapshot = session.getSnapshot();
    pendingRead.resolve();
    await settle();

    expect(signal.aborted).toBe(true);
    expect(onRead).not.toHaveBeenCalled();
    expect(session.getSnapshot()).toBe(stoppedSnapshot);
  });
});

describe("ChatSession access revocation", () => {
  it.each([403, 404])("stops and erases the timeline when older history is rejected with %s", async (status) => {
    const { session, events, loadHistory, transports } = createSession();
    loadHistory.mockResolvedValueOnce(history([message(1)], 2));
    session.start();
    await settle();
    events[0].onConnection("connected");
    const signal = loadHistory.mock.calls[0][1];
    loadHistory.mockRejectedValueOnce({ response: { status } });

    await session.loadOlder();
    events[0].onMessage(message(2));
    expect(session.getSnapshot()).toMatchObject({
      accessDenied: true,
      messages: [],
      connection: "error",
      historyStatus: "error",
      hasMore: false,
    });
    expect(signal.aborted).toBe(true);
    expect(transports[0].stop).toHaveBeenCalledOnce();
    expect(session.publish({ content: "차단할 전송", senderId: 7 })).toBe(false);
  });

  it.each([403, 404])("stops and erases the timeline when a read is rejected with %s", async (status) => {
    vi.useFakeTimers();
    const { session, events, loadHistory, markRead, transports, onRead } = createSession();
    loadHistory.mockResolvedValueOnce(history([message(1)]));
    markRead.mockRejectedValueOnce({ response: { status } });
    session.start();
    await settle();
    events[0].onConnection("connected");
    session.setReading(true);

    await vi.advanceTimersByTimeAsync(300);
    events[0].onMessage(message(2));
    expect(session.getSnapshot()).toMatchObject({ accessDenied: true, messages: [], connection: "error" });
    expect(markRead.mock.calls[0][0].aborted).toBe(true);
    expect(transports[0].stop).toHaveBeenCalledOnce();
    expect(onRead).not.toHaveBeenCalled();
    expect(session.publish({ content: "차단할 전송", senderId: 7 })).toBe(false);
  });
});

describe("ChatSession reading state after a temporary pause", () => {
  it("resumes read updates without requiring another scroll event", async () => {
    vi.useFakeTimers();
    const { session, markRead } = createSession();
    session.setReading(true);
    session.start();
    await settle();
    await vi.advanceTimersByTimeAsync(300);
    expect(markRead).toHaveBeenCalledOnce();
    session.stop();
    session.start();
    await settle();
    await vi.advanceTimersByTimeAsync(300);
    expect(markRead).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});
