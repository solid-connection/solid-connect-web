import { describe, expect, it } from "vitest";
import { parseChatMessage } from "./normalize";

const message = {
  id: "12",
  content: "안녕하세요",
  senderId: "3",
  createdAt: "2026-10-27T01:00:00Z",
};

describe("parseChatMessage", () => {
  it("accepts the legacy siteUserId field and an omitted attachment list", () => {
    expect(parseChatMessage({ ...message, senderId: undefined, siteUserId: "7" })).toEqual({
      id: 12,
      content: "안녕하세요",
      senderId: 7,
      createdAt: message.createdAt,
      attachments: [],
    });
  });

  it("normalizes valid image attachments without a thumbnail", () => {
    const parsed = parseChatMessage({
      ...message,
      attachments: [{ id: "9", isImage: true, url: "/image.png", createdAt: message.createdAt }],
    });

    expect(parsed?.attachments[0]).toEqual({
      id: 9,
      isImage: true,
      url: "/image.png",
      thumbnailUrl: null,
      createdAt: message.createdAt,
    });
  });

  it.each([
    null,
    [],
    { ...message, content: 2 },
    { ...message, senderId: undefined },
    { ...message, senderId: "invalid" },
    { ...message, senderId: 0 },
    { ...message, createdAt: "invalid" },
    { ...message, createdAt: 123 },
    { ...message, attachments: {} },
    { ...message, attachments: [null] },
    { ...message, attachments: [{ isImage: true, url: "/image.png", createdAt: "invalid" }] },
    { ...message, attachments: [{ isImage: "true", url: "/image.png", createdAt: message.createdAt }] },
    { ...message, attachments: [{ isImage: true, url: 12, createdAt: message.createdAt }] },
  ])("rejects a malformed frame without throwing: %j", (value) => {
    expect(parseChatMessage(value)).toBeNull();
  });

  it("gives the same ID to repeated messages that omit a server ID", () => {
    const withoutId = { ...message, id: undefined };
    const first = parseChatMessage(withoutId);
    const second = parseChatMessage(withoutId);

    expect(first?.id).toBeLessThan(0);
    expect(first?.id).toBe(second?.id);
  });
});
