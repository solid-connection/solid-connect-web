// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createStompTransport } from "./stompTransport";
import type { ChatTransport } from "./types";

interface MockClient {
  options: { webSocketFactory(): unknown };
  connected: boolean;
  beforeConnect?: () => Promise<void>;
  onConnect?: () => void;
  onWebSocketClose?: () => void;
  onStompError?: () => void;
  subscriptions: Map<string, (frame: { body: string }) => void>;
  activate: ReturnType<typeof vi.fn>;
  deactivate: ReturnType<typeof vi.fn>;
  publish: ReturnType<typeof vi.fn>;
}

const { clients, socketFactory } = vi.hoisted(() => ({
  clients: [] as MockClient[],
  socketFactory: vi.fn(function createSocket(url: string) {
    return { url };
  }),
}));

vi.mock("sockjs-client", () => ({ default: socketFactory }));
vi.mock("@stomp/stompjs", () => ({
  Client: class {
    connected = false;
    subscriptions = new Map<string, (frame: { body: string }) => void>();
    activate = vi.fn();
    deactivate = vi.fn(async () => {
      this.connected = false;
    });
    publish = vi.fn();
    constructor(public options: { webSocketFactory(): unknown }) {
      clients.push(this);
    }
    subscribe(destination: string, callback: (frame: { body: string }) => void) {
      this.subscriptions.set(destination, callback);
      return { unsubscribe: vi.fn() };
    }
  },
}));

const transports: ChatTransport[] = [];

function createTransport(getAccessToken = vi.fn<() => Promise<string | null>>().mockResolvedValue("first token")) {
  const onConnection = vi.fn();
  const onConnected = vi.fn();
  const onMessage = vi.fn();
  const transport = createStompTransport({ roomId: 42, getAccessToken, onConnection, onConnected, onMessage });
  transports.push(transport);
  return { transport, getAccessToken, onConnection, onConnected, onMessage };
}

beforeEach(() => {
  clients.splice(0);
  socketFactory.mockClear();
  vi.stubEnv("NEXT_PUBLIC_API_SERVER_URL", "https://api.example.com/");
  vi.spyOn(window.navigator, "onLine", "get").mockReturnValue(true);
});

afterEach(() => {
  for (const transport of transports.splice(0)) transport.stop();
  vi.unstubAllEnvs();
});

describe("STOMP transport lifecycle", () => {
  it("obtains a fresh token before every connect and encodes it in the SockJS URL", async () => {
    const { transport, getAccessToken, onConnection, onConnected } = createTransport();
    getAccessToken.mockResolvedValueOnce("first token").mockResolvedValueOnce("new/token?");
    transport.start();
    transport.start();
    expect(clients).toHaveLength(1);
    const client = clients[0];
    await client.beforeConnect?.();
    client.options.webSocketFactory();
    client.connected = true;
    client.onConnect?.();
    await client.beforeConnect?.();
    client.options.webSocketFactory();

    expect(getAccessToken).toHaveBeenCalledTimes(2);
    expect(socketFactory.mock.calls.map(([url]) => url)).toEqual([
      "https://api.example.com/connect?token=first%20token",
      "https://api.example.com/connect?token=new%2Ftoken%3F",
    ]);
    expect(onConnected).toHaveBeenCalledOnce();
    expect(onConnection.mock.calls.map(([state]) => state)).toEqual(["connecting", "connected", "reconnecting"]);
  });

  it("rejects a stopped socket factory when token acquisition resolves late", async () => {
    let resolveToken!: (token: string) => void;
    const getAccessToken = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          resolveToken = resolve;
        }),
    );
    const { transport, onConnection, onConnected, onMessage } = createTransport(getAccessToken);
    transport.start();
    const client = clients[0];
    const connecting = client.beforeConnect?.();
    transport.stop();
    resolveToken("late token");
    await connecting;
    client.onConnect?.();

    expect(() => client.options.webSocketFactory()).toThrow("채팅 연결이 종료되었습니다.");
    expect(client.deactivate).toHaveBeenCalledOnce();
    expect(socketFactory).not.toHaveBeenCalled();
    expect(onConnected).not.toHaveBeenCalled();
    expect(onMessage).not.toHaveBeenCalled();
    expect(onConnection.mock.calls.map(([state]) => state)).toEqual(["connecting"]);
  });

  it("disposes offline connections and removes online listeners when stopped", () => {
    const online = vi.spyOn(window.navigator, "onLine", "get").mockReturnValue(true);
    const addListener = vi.spyOn(window, "addEventListener");
    const removeListener = vi.spyOn(window, "removeEventListener");
    const { transport, onConnection } = createTransport();
    transport.start();
    online.mockReturnValue(false);
    window.dispatchEvent(new Event("offline"));
    expect(clients[0].deactivate).toHaveBeenCalledOnce();
    expect(onConnection).toHaveBeenLastCalledWith("offline");

    online.mockReturnValue(true);
    window.dispatchEvent(new Event("online"));
    expect(clients).toHaveLength(2);
    transport.stop();
    window.dispatchEvent(new Event("online"));
    expect(clients).toHaveLength(2);
    for (const type of ["offline", "online"]) {
      const added = addListener.mock.calls.find(([eventType]) => eventType === type);
      expect(removeListener).toHaveBeenCalledWith(type, added?.[1]);
    }
  });

  it("ignores malformed frames and callbacks belonging to a replaced connection", async () => {
    const { transport, onMessage } = createTransport();
    transport.start();
    const original = clients[0];
    await original.beforeConnect?.();
    original.onConnect?.();
    const callback = original.subscriptions.get("/topic/chat/42");
    callback?.({ body: "{" });
    callback?.({ body: "null" });
    callback?.({ body: JSON.stringify({ id: 1, content: "안녕", senderId: 7, createdAt: "2026-10-27T00:00:00Z" }) });
    expect(onMessage).toHaveBeenCalledOnce();

    transport.reconnect();
    callback?.({
      body: JSON.stringify({ id: 2, content: "늦은 메시지", senderId: 7, createdAt: "2026-10-27T00:00:01Z" }),
    });
    original.onConnect?.();
    expect(onMessage).toHaveBeenCalledOnce();
  });

  it("publishes only while connected and never replays a message on reconnect", async () => {
    const { transport } = createTransport();
    expect(() => transport.publish({ content: "보관", senderId: 7 })).toThrow();
    transport.start();
    const client = clients[0];
    await client.beforeConnect?.();
    client.connected = true;
    client.onConnect?.();
    transport.publish({ content: "텍스트", senderId: 7 });
    transport.publish({ imageUrls: ["https://cdn.example.com/image.png"] });
    expect(client.publish.mock.calls.map(([payload]) => payload)).toEqual([
      { destination: "/publish/chat/42", body: JSON.stringify({ content: "텍스트", senderId: 7 }) },
      {
        destination: "/publish/chat/42/image",
        body: JSON.stringify({ imageUrls: ["https://cdn.example.com/image.png"] }),
      },
    ]);
    transport.reconnect();
    expect(clients[1].publish).not.toHaveBeenCalled();
    transport.stop();
    expect(() => transport.publish({ content: "보관", senderId: 7 })).toThrow();
  });
});
