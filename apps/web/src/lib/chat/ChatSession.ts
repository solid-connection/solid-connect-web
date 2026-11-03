import type { ChatHistoriesResponse } from "@/apis/chat";
import type { ChatMessage } from "@/types/chat";
import { getMessageKey, mergeMessages } from "./messages";
import type { ChatPayload, ChatSnapshot, ChatTransport, ChatTransportEvents, OutgoingMessage } from "./types";

interface ChatSessionOptions {
  userId: number;
  loadHistory(page: number, signal: AbortSignal): Promise<ChatHistoriesResponse>;
  markRead(signal: AbortSignal): Promise<void>;
  createTransport(events: ChatTransportEvents): ChatTransport;
  initialOutgoing?: OutgoingMessage[];
  saveOutgoing(messages: OutgoingMessage[]): void;
  onMessagesChanged(): void;
  onRead(): void;
  confirmationTimeoutMs?: number;
}

const getErrorMessage = (error: unknown) => {
  const status = (error as { response?: { status?: number } })?.response?.status;
  if (status === 403 || status === 404) return "이 채팅방에 접근할 수 없습니다.";
  return "메시지를 불러오지 못했어요. 다시 시도해주세요.";
};

const imageKey = (url: string) => {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
};

// One owner for a room's timeline. HTTP pages and socket events only merge into this snapshot.
export class ChatSession {
  private snapshot: ChatSnapshot;
  private readonly listeners = new Set<() => void>();
  private transport: ChatTransport | null = null;
  private controller: AbortController | null = null;
  private generation = 0;
  private nextOlderPage: number | null = null;
  private reading = false;
  private readVersion = 0;
  private lastReadVersion = -1;
  private readInFlight = false;
  private readTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly confirmationTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private syncPromise: Promise<void> | null = null;
  private resyncRequested = false;
  private readonly synchronizedKeys = new Set<string>();
  private hasSynchronizedHistory = false;

  constructor(private readonly options: ChatSessionOptions) {
    this.snapshot = {
      messages: [],
      outgoing: (options.initialOutgoing ?? []).map((item) => ({ ...item, status: "unconfirmed" })),
      connection: "connecting",
      historyStatus: "loading",
      historyError: null,
      syncError: null,
      olderError: null,
      isSyncing: false,
      isLoadingOlder: false,
      hasMore: false,
      accessDenied: false,
      readError: false,
    };
  }

  getSnapshot = () => this.snapshot;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private update(patch: Partial<ChatSnapshot>) {
    this.snapshot = { ...this.snapshot, ...patch };
    for (const listener of this.listeners) listener();
  }

  private updateOutgoing(outgoing: OutgoingMessage[]) {
    this.options.saveOutgoing(outgoing);
    this.update({ outgoing });
  }

  private isCurrent(generation: number) {
    return this.controller !== null && !this.controller.signal.aborted && this.generation === generation;
  }

  private denyAccess() {
    this.stop();
    this.update({
      accessDenied: true,
      connection: "error",
      messages: [],
      hasMore: false,
      historyStatus: "error",
      historyError: "이 채팅방에 접근할 수 없습니다.",
      syncError: null,
    });
  }

  private isAccessError(error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    return status === 403 || status === 404;
  }

  start() {
    if (this.controller) return;
    const generation = ++this.generation;
    this.controller = new AbortController();
    this.update({ connection: "connecting", accessDenied: false });
    this.transport = this.options.createTransport({
      onConnection: (connection) => {
        if (this.isCurrent(generation)) this.update({ connection });
      },
      onConnected: () => {
        if (this.isCurrent(generation)) void this.syncLatest();
      },
      onMessage: (message) => {
        if (this.isCurrent(generation)) this.receive(message);
      },
    });
    this.transport.start();
    void this.syncLatest();
  }

  stop() {
    this.generation += 1;
    this.controller?.abort();
    this.controller = null;
    this.transport?.stop();
    this.transport = null;
    this.syncPromise = null;
    this.resyncRequested = false;
    this.readInFlight = false;
    this.reading = false;
    if (this.readTimer) clearTimeout(this.readTimer);
    this.readTimer = null;
    for (const timer of this.confirmationTimers.values()) clearTimeout(timer);
    this.confirmationTimers.clear();
    this.updateOutgoing(this.snapshot.outgoing.map((item) => ({ ...item, status: "unconfirmed" })));
    this.update({ connection: "disconnected", isSyncing: false, isLoadingOlder: false });
  }

  reconnect = () => {
    if (this.snapshot.accessDenied) return;
    this.transport?.reconnect();
  };

  syncLatest = (): Promise<void> => {
    if (!this.controller || this.snapshot.accessDenied) return Promise.resolve();
    if (this.syncPromise) {
      // The subscription may become ready after the initial HTTP snapshot was taken.
      this.resyncRequested = true;
      return this.syncPromise;
    }
    const generation = this.generation;
    const signal = this.controller.signal;
    // Live messages can arrive across a gap. Only a completed HTTP sync is an overlap boundary.
    const previouslySeen = new Set(this.synchronizedKeys);
    const initialLoad = !this.hasSynchronizedHistory;
    this.update({ isSyncing: true, historyError: null, syncError: null });

    const request = async () => {
      try {
        let page = 1;
        const visited = new Set<number>();
        const fetchedKeys = new Set<string>();
        let followingPage = -1;
        while (true) {
          if (visited.has(page)) throw new Error("반복되는 채팅 페이지입니다.");
          visited.add(page);
          const result = await this.options.loadHistory(page, signal);
          if (!this.isCurrent(generation)) return;
          followingPage = result.nextPageNumber;
          const reachedKnownMessage = result.content.some((message) => previouslySeen.has(getMessageKey(message)));
          for (const message of result.content) fetchedKeys.add(getMessageKey(message));
          this.update({ messages: mergeMessages(this.snapshot.messages, result.content), historyStatus: "ready" });
          if (initialLoad && page === 1)
            this.nextOlderPage = result.nextPageNumber === -1 ? null : result.nextPageNumber;
          if (result.nextPageNumber === -1) {
            this.nextOlderPage = null;
            break;
          }
          if ((initialLoad && previouslySeen.size === 0) || reachedKnownMessage) break;
          if (!Number.isSafeInteger(result.nextPageNumber) || result.nextPageNumber <= page) {
            throw new Error("잘못된 채팅 페이지입니다.");
          }
          page = result.nextPageNumber;
        }
        if (!initialLoad && this.nextOlderPage !== null && followingPage !== -1) {
          this.nextOlderPage = Math.max(this.nextOlderPage, followingPage);
        }
        for (const key of fetchedKeys) this.synchronizedKeys.add(key);
        this.hasSynchronizedHistory = true;
        this.update({ hasMore: this.nextOlderPage !== null });
        this.readVersion += 1;
        this.queueRead();
        this.options.onMessagesChanged();
      } catch (error) {
        if (!this.isCurrent(generation)) return;
        if (this.isAccessError(error)) {
          this.denyAccess();
          return;
        }
        const hasMessages = this.snapshot.messages.length > 0;
        this.update({
          historyStatus: hasMessages ? "ready" : "error",
          historyError: hasMessages ? null : getErrorMessage(error),
          syncError: hasMessages ? getErrorMessage(error) : null,
        });
      } finally {
        if (this.isCurrent(generation)) {
          this.syncPromise = null;
          this.update({ isSyncing: false });
          if (this.resyncRequested) {
            this.resyncRequested = false;
            void this.syncLatest();
          }
        }
      }
    };
    this.syncPromise = request();
    return this.syncPromise;
  };

  loadOlder = async () => {
    if (!this.controller || this.nextOlderPage === null || this.snapshot.isLoadingOlder || this.snapshot.accessDenied)
      return;
    const generation = this.generation;
    let page = this.nextOlderPage;
    this.update({ isLoadingOlder: true, olderError: null });
    try {
      while (true) {
        const result = await this.options.loadHistory(page, this.controller.signal);
        if (!this.isCurrent(generation)) return;
        if (result.nextPageNumber !== -1 && result.nextPageNumber <= page) throw new Error("잘못된 채팅 페이지입니다.");
        const knownKeys = new Set(this.snapshot.messages.map(getMessageKey));
        const hasNewMessages = result.content.some((message) => !knownKeys.has(getMessageKey(message)));
        this.nextOlderPage =
          result.nextPageNumber === -1 || this.nextOlderPage === null
            ? null
            : Math.max(this.nextOlderPage, result.nextPageNumber);
        this.update({
          messages: mergeMessages(this.snapshot.messages, result.content),
          hasMore: this.nextOlderPage !== null,
        });
        if (hasNewMessages || this.nextOlderPage === null) break;
        // Offset pages can overlap after new arrivals. One click continues until older messages are found.
        page = this.nextOlderPage;
      }
    } catch (error) {
      if (!this.isCurrent(generation)) return;
      if (this.isAccessError(error)) this.denyAccess();
      else this.update({ olderError: getErrorMessage(error) });
    } finally {
      if (this.isCurrent(generation)) this.update({ isLoadingOlder: false });
    }
  };

  private receive(message: ChatMessage) {
    const key = getMessageKey(message);
    const isDuplicate = this.snapshot.messages.some((existing) => getMessageKey(existing) === key);
    this.update({ messages: mergeMessages(this.snapshot.messages, [message]) });
    // A missing server id cannot confirm delivery. Duplicate frames cannot confirm another send.
    if (!isDuplicate && message.id > 0 && message.senderId === this.options.userId) this.confirmOutgoing(message);
    if (!isDuplicate) {
      this.readVersion += 1;
      this.queueRead();
      this.options.onMessagesChanged();
    }
  }

  private confirmOutgoing(message: ChatMessage) {
    const imageUrls = message.attachments.filter((item) => item.isImage).map((item) => imageKey(item.url));
    const index = this.snapshot.outgoing.findIndex((item) => {
      if (item.imageUrls.length > 0) return item.remainingImageUrls.some((url) => imageUrls.includes(imageKey(url)));
      return imageUrls.length === 0 && item.content.trim() === message.content.trim();
    });
    if (index === -1) return;
    const outgoing = [...this.snapshot.outgoing];
    const item = outgoing[index];
    const remainingImageUrls = item.remainingImageUrls.filter((url) => !imageUrls.includes(imageKey(url)));
    if (remainingImageUrls.length > 0) {
      outgoing[index] = { ...item, remainingImageUrls };
    } else {
      const timer = this.confirmationTimers.get(item.clientId);
      if (timer) clearTimeout(timer);
      this.confirmationTimers.delete(item.clientId);
      outgoing.splice(index, 1);
    }
    this.updateOutgoing(outgoing);
  }

  publish = (payload: ChatPayload): boolean => {
    if (!this.controller || this.snapshot.accessDenied || this.snapshot.connection !== "connected") return false;
    if ("content" in payload && !payload.content.trim()) return false;
    if ("imageUrls" in payload && payload.imageUrls.length === 0) return false;
    const clientId = crypto.randomUUID();
    const outgoing: OutgoingMessage = {
      clientId,
      content: "content" in payload ? payload.content : "",
      imageUrls: "imageUrls" in payload ? [...payload.imageUrls] : [],
      remainingImageUrls: "imageUrls" in payload ? [...payload.imageUrls] : [],
      senderId: this.options.userId,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    this.updateOutgoing([...this.snapshot.outgoing, outgoing]);
    try {
      if (!this.transport) throw new Error("연결이 없습니다.");
      this.transport.publish(payload);
      if (this.snapshot.outgoing.some((item) => item.clientId === clientId)) {
        this.confirmationTimers.set(
          clientId,
          setTimeout(() => {
            this.confirmationTimers.delete(clientId);
            this.updateOutgoing(
              this.snapshot.outgoing.map((item) =>
                item.clientId === clientId ? { ...item, status: "unconfirmed" } : item,
              ),
            );
          }, this.options.confirmationTimeoutMs ?? 15000),
        );
      }
      return true;
    } catch {
      this.updateOutgoing(this.snapshot.outgoing.filter((item) => item.clientId !== clientId));
      return false;
    }
  };

  sendImages = async (
    files: File[],
    upload: (files: File[], signal: AbortSignal) => Promise<string[]>,
  ): Promise<boolean> => {
    if (!this.controller || this.snapshot.connection !== "connected" || this.snapshot.accessDenied) return false;
    const generation = this.generation;
    const urls = await upload(files, this.controller.signal);
    // An upload belongs to the room and login session in which it started.
    if (!this.isCurrent(generation)) return false;
    if (urls.length !== files.length || urls.some((url) => !url))
      throw new Error("이미지 업로드 결과를 확인할 수 없습니다.");
    return this.publish({ imageUrls: urls });
  };

  dismissOutgoing = (clientId: string) => {
    const timer = this.confirmationTimers.get(clientId);
    if (timer) clearTimeout(timer);
    this.confirmationTimers.delete(clientId);
    this.updateOutgoing(this.snapshot.outgoing.filter((item) => item.clientId !== clientId));
  };

  setReading = (reading: boolean) => {
    this.reading = reading;
    if (reading) this.queueRead();
  };

  retryRead = () => {
    this.update({ readError: false });
    this.queueRead();
  };

  private queueRead() {
    if (
      !this.controller ||
      !this.reading ||
      this.snapshot.historyStatus !== "ready" ||
      this.snapshot.accessDenied ||
      this.readInFlight ||
      this.readTimer ||
      this.lastReadVersion === this.readVersion
    )
      return;
    const generation = this.generation;
    this.readTimer = setTimeout(() => {
      this.readTimer = null;
      void this.flushRead(generation);
    }, 300);
  }

  private async flushRead(generation: number) {
    if (!this.isCurrent(generation) || !this.reading || !this.controller) return;
    const version = this.readVersion;
    this.readInFlight = true;
    try {
      await this.options.markRead(this.controller.signal);
      if (!this.isCurrent(generation)) return;
      this.lastReadVersion = version;
      this.update({ readError: false });
      this.options.onRead();
    } catch (error) {
      if (!this.isCurrent(generation)) return;
      if (this.isAccessError(error)) this.denyAccess();
      else this.update({ readError: true });
    } finally {
      if (this.isCurrent(generation)) {
        this.readInFlight = false;
        if (!this.snapshot.readError) this.queueRead();
      }
    }
  }
}
