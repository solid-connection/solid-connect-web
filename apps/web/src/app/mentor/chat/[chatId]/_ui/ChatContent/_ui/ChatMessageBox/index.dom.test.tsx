// @vitest-environment jsdom
import { act, fireEvent, render, screen } from "@testing-library/react/pure";
import { expect, it, vi } from "vitest";
import type { ChatMessage } from "@/types/chat";
import { downloadFile } from "@/utils/fileUtils";
import ChatMessageBox from ".";

vi.mock("@/components/ui/ProfileWithBadge", () => ({ default: () => <span /> }));
vi.mock("@/utils/fileUtils", () => ({
  downloadFile: vi.fn().mockResolvedValue(undefined),
  getFileExtension: () => "PDF",
  getFileNamePrefix: () => "document",
}));

const imageMessage: ChatMessage = {
  id: 1,
  content: "",
  senderId: 2,
  createdAt: "2026-10-27T00:00:00.000Z",
  attachments: [
    {
      id: 5,
      isImage: true,
      url: "https://example.com/image.png",
      thumbnailUrl: null,
      createdAt: "2026-10-27T00:00:00.000Z",
    },
  ],
};

const getImage = () => screen.getByRole("img", { name: "첨부 이미지" });
const advanceRetry = () =>
  act(() => {
    vi.advanceTimersByTime(1000);
  });

it("stops after three failed image attempts and retries only when requested", () => {
  vi.useFakeTimers();
  render(<ChatMessageBox message={imageMessage} currentUserId={1} />);
  const firstSrc = getImage().getAttribute("src");
  fireEvent.error(getImage());
  advanceRetry();
  expect(getImage().getAttribute("src")).not.toBe(firstSrc);
  fireEvent.error(getImage());
  advanceRetry();
  fireEvent.error(getImage());

  expect(screen.queryByRole("img", { name: "첨부 이미지" })).toBeNull();
  expect(screen.getByRole("status").textContent).toContain("불러오지 못했어요");
  expect(vi.getTimerCount()).toBe(0);
  act(() => {
    vi.advanceTimersByTime(30000);
  });
  expect(screen.queryByRole("img", { name: "첨부 이미지" })).toBeNull();

  fireEvent.click(screen.getByRole("button", { name: "다시 불러오기" }));
  expect(getImage().getAttribute("src")).not.toBe(firstSrc);
  fireEvent.load(getImage());
  expect(screen.queryByRole("status")).toBeNull();
});

it("cancels image retry timers when the message unmounts", () => {
  vi.useFakeTimers();
  const { unmount } = render(<ChatMessageBox message={imageMessage} currentUserId={1} />);
  fireEvent.error(getImage());
  expect(vi.getTimerCount()).toBe(1);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});

it("resets image loading and cancels the old retry when its source changes", () => {
  vi.useFakeTimers();
  const { rerender } = render(<ChatMessageBox message={imageMessage} currentUserId={1} />);
  fireEvent.error(getImage());
  const replacement = {
    ...imageMessage,
    attachments: [{ ...imageMessage.attachments[0], url: "https://example.com/replacement.png" }],
  };
  rerender(<ChatMessageBox message={replacement} currentUserId={1} />);
  expect(getImage().getAttribute("src")).toBe("https://example.com/replacement.png");
  expect(vi.getTimerCount()).toBe(0);
  fireEvent.load(getImage());
  expect(screen.queryByRole("status")).toBeNull();
});

it("keeps received file downloads available through a native button", () => {
  const fileMessage = {
    ...imageMessage,
    attachments: [{ ...imageMessage.attachments[0], isImage: false, url: "https://example.com/document.pdf" }],
  };
  render(<ChatMessageBox message={fileMessage} currentUserId={1} />);
  fireEvent.click(screen.getByRole("button", { name: /첨부파일/ }));
  expect(downloadFile).toHaveBeenCalledExactlyOnceWith("https://example.com/document.pdf", "document");
});
