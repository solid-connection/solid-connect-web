import { AxiosHeaders } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosInstance } from "@/utils/axiosInstance";
import { chatApi } from "./api";

vi.mock("@/utils/axiosInstance", () => ({
  axiosInstance: { get: vi.fn(), put: vi.fn() },
}));

const resolveHistory = (data: unknown) =>
  vi.mocked(axiosInstance.get).mockResolvedValueOnce({
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe("chatApi.getChatHistories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts an empty page that still points to the next page", async () => {
    resolveHistory({ content: [], nextPageNumber: 2 });
    await expect(chatApi.getChatHistories({ roomId: 1 })).resolves.toEqual({ content: [], nextPageNumber: 2 });
  });

  it("keeps page one as the default and passes the cancellation signal to Axios", async () => {
    resolveHistory({ content: [], nextPageNumber: -1 });
    const controller = new AbortController();
    await chatApi.getChatHistories({ roomId: 1, signal: controller.signal });

    expect(axiosInstance.get).toHaveBeenCalledWith("/chats/rooms/1", {
      params: { page: 1, size: 20 },
      signal: controller.signal,
    });
  });

  it.each([
    0,
    1,
    -2,
    1.5,
    Number.POSITIVE_INFINITY,
    "2",
    null,
    undefined,
  ])("rejects a cursor that cannot advance from page one: %j", async (nextPageNumber) => {
    resolveHistory({ content: [], nextPageNumber });
    await expect(chatApi.getChatHistories({ roomId: 1 })).rejects.toThrow();
  });

  it("fails the page if even one malformed message is present", async () => {
    const valid = { id: 1, content: "정상 메시지", senderId: 1, createdAt: "2026-10-27T01:00:00Z" };
    resolveHistory({ content: [valid, { ...valid, id: 2, createdAt: "invalid" }], nextPageNumber: -1 });

    await expect(chatApi.getChatHistories({ roomId: 1 })).rejects.toThrow("올바르지 않은 메시지");
  });

  it.each([
    null,
    {},
    { content: null, nextPageNumber: -1 },
    { content: {}, nextPageNumber: -1 },
  ])("rejects a malformed history envelope: %j", async (data) => {
    resolveHistory(data);
    await expect(chatApi.getChatHistories({ roomId: 1 })).rejects.toThrow("채팅 내역 응답");
  });
});
