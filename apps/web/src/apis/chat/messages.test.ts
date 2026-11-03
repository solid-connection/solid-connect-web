import { describe, expect, it } from "vitest";
import { getMessageKey, mergeMessages } from "@/lib/chat/messages";
import type { ChatMessage } from "@/types/chat";
import { parseChatMessage } from "./normalize";

const message = (id: number, overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id,
  content: `메시지 ${id}`,
  senderId: 1,
  createdAt: "2026-10-27T01:00:00Z",
  attachments: [],
  ...overrides,
});

describe("mergeMessages", () => {
  it("reconciles history overlap and a socket echo by server ID", () => {
    const existing = [message(2), message(1)];
    const incoming = [message(2, { content: "서버가 확정한 내용" }), message(3)];

    expect(mergeMessages(existing, incoming)).toEqual([message(1), incoming[0], incoming[1]]);
    expect(existing.map((item) => item.id)).toEqual([2, 1]);
    expect(incoming.map((item) => item.id)).toEqual([2, 3]);
  });

  it("orders by timestamp before using ID for simultaneous messages", () => {
    const earlier = message(99, { createdAt: "2026-10-27T00:59:00Z" });
    expect(mergeMessages([message(3)], [message(2), earlier]).map((item) => item.id)).toEqual([99, 2, 3]);
  });

  it("preserves distinct messages whose fallback numeric IDs collide", () => {
    const first = parseChatMessage({ ...message(0), id: undefined, content: "Aa" });
    const second = parseChatMessage({ ...message(0), id: undefined, content: "BB" });

    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(first?.id).toBe(second?.id);
    expect(getMessageKey(first!)).not.toBe(getMessageKey(second!));
    expect(mergeMessages([first!], [second!])).toHaveLength(2);
  });

  it("deduplicates repeated messages with no server ID using their full fingerprint", () => {
    const first = message(-12);
    const same = { ...first, id: -30 };
    expect(mergeMessages([first], [same])).toEqual([same]);
  });
});
