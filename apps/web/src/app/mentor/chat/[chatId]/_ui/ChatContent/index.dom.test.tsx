// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react/pure";
import type { ReactNode } from "react";
import { beforeEach, expect, it, vi } from "vitest";
import type { ChatSnapshot } from "@/lib/chat/types";
import { useChatSession } from "@/lib/chat/useChatSession";
import type { ChatMessage } from "@/types/chat";
import ChatContent from ".";

const mocks = vi.hoisted(() => ({
  partner: {
    isSuccess: true,
    isError: false,
    error: null as { response: { status: number } } | null,
    data: { nickname: "상대방", profileUrl: null },
    refetch: vi.fn(),
  },
  snapshot: {} as ChatSnapshot,
  sendText: vi.fn<() => Promise<boolean>>(),
  sendImages: vi.fn<() => Promise<boolean>>(),
}));

vi.mock("@/apis/chat", () => ({ useGetPartnerInfo: () => mocks.partner }));
vi.mock("@/app/mentor/chat/_ui/ChatAccess", () => ({
  default: ({ children }: { children: (userId: number) => ReactNode }) => children(7),
}));
vi.mock("@/lib/zustand/useAuthStore", () => ({
  default: (selector: (state: { clientRole: string; serverRole: string }) => unknown) =>
    selector({ clientRole: "MENTEE", serverRole: "MENTEE" }),
}));
vi.mock("@/lib/chat/useChatSession", () => ({
  useChatSession: vi.fn(() => ({
    snapshot: mocks.snapshot,
    sendText: mocks.sendText,
    sendImages: mocks.sendImages,
    session: {
      setReading: vi.fn(),
      reconnect: vi.fn(),
      syncLatest: vi.fn(),
      loadOlder: vi.fn(),
      retryRead: vi.fn(),
      dismissOutgoing: vi.fn(),
    },
  })),
}));
vi.mock("@/lib/chat/useChatScroll", () => ({
  useChatScroll: () => ({
    containerRef: { current: null },
    contentRef: { current: null },
    onScroll: vi.fn(),
    captureAnchor: vi.fn(),
    scrollToBottom: vi.fn(),
    hasNewMessages: false,
  }),
}));
vi.mock("../ChatNavBar", () => ({ default: () => <nav aria-label="채팅 탐색" /> }));
vi.mock("./_ui/ChatMessageBox", () => ({
  default: ({ message }: { message: ChatMessage }) => <p>{message.content}</p>,
}));
vi.mock("@/public/svgs/mentor", () => ({ IconAlbum: () => <span />, IconDirectMessage: () => <span /> }));

beforeEach(() => {
  Object.assign(mocks.partner, { isSuccess: true, isError: false, error: null });
  mocks.partner.refetch.mockClear();
  mocks.sendText.mockReset().mockResolvedValue(true);
  mocks.sendImages.mockReset().mockResolvedValue(true);
  vi.mocked(useChatSession).mockClear();
  mocks.snapshot = {
    connection: "connected",
    historyStatus: "ready",
    historyError: null,
    syncError: null,
    olderError: null,
    isSyncing: false,
    isLoadingOlder: false,
    hasMore: true,
    accessDenied: false,
    readError: false,
    messages: [
      { id: 1, senderId: 8, content: "이전에 불러온 비공개 대화", createdAt: "2026-10-27T01:00:00Z", attachments: [] },
    ],
    outgoing: [
      {
        clientId: "pending-1",
        senderId: 7,
        content: "전송 확인을 기다리는 원문",
        createdAt: "2026-10-27T01:01:00Z",
        imageUrls: [],
        remainingImageUrls: [],
        status: "unconfirmed",
      },
    ],
  };
});

it.each([
  403, 404,
])("hides existing history and outgoing messages when partner access later fails with %i", (status) => {
  const { rerender } = render(<ChatContent chatId={42} />);
  expect(screen.getByText("이전에 불러온 비공개 대화")).toBeTruthy();
  expect(screen.getByText("전송 확인을 기다리는 원문")).toBeTruthy();
  const composer = screen.getByRole("textbox", { name: "메시지" }) as HTMLTextAreaElement;
  fireEvent.change(composer, { target: { value: "접근 거부 후 보내지 않을 초안" } });
  expect(composer.disabled).toBe(false);

  Object.assign(mocks.partner, { isSuccess: false, isError: true, error: { response: { status } } });
  mocks.snapshot.connection = "disconnected";
  rerender(<ChatContent chatId={42} />);

  expect(screen.getByRole("alert").textContent).toContain("이 채팅방에 접근할 수 없습니다.");
  expect(screen.queryByText("이전에 불러온 비공개 대화")).toBeNull();
  expect(screen.queryByText("전송 확인을 기다리는 원문")).toBeNull();
  expect(screen.queryByRole("button", { name: "이전 메시지 더 보기" })).toBeNull();
  expect(screen.queryByRole("button", { name: "다시 연결" })).toBeNull();
  expect(composer.disabled).toBe(true);
  expect((screen.getByLabelText("채팅 이미지 선택") as HTMLInputElement).disabled).toBe(true);
  expect(useChatSession).toHaveBeenLastCalledWith(42, 7, false);

  fireEvent.submit(screen.getByRole("form", { name: "채팅 메시지 작성" }));
  expect(mocks.sendText).not.toHaveBeenCalled();
  expect(mocks.sendImages).not.toHaveBeenCalled();
});

it("keeps the previous conversation after a transient partner failure while pausing sends", () => {
  const { rerender } = render(<ChatContent chatId={42} />);
  Object.assign(mocks.partner, { isSuccess: false, isError: true, error: { response: { status: 503 } } });
  mocks.snapshot.connection = "disconnected";
  rerender(<ChatContent chatId={42} />);

  expect(screen.getByRole("alert").textContent).toContain("상대 정보를 불러오지 못했어요.");
  expect(screen.queryByText("이 채팅방에 접근할 수 없습니다.")).toBeNull();
  expect(screen.getByText("이전에 불러온 비공개 대화")).toBeTruthy();
  expect(screen.getByText("전송 확인을 기다리는 원문")).toBeTruthy();
  expect((screen.getByRole("textbox", { name: "메시지" }) as HTMLTextAreaElement).disabled).toBe(true);
  expect(useChatSession).toHaveBeenLastCalledWith(42, 7, false);

  fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));
  expect(mocks.partner.refetch).toHaveBeenCalledOnce();
});
