// @vitest-environment jsdom
import { act, fireEvent, render, screen } from "@testing-library/react/pure";
import { beforeEach, expect, it, vi } from "vitest";
import type { ChatMessage } from "@/types/chat";
import { getMessageKey } from "./messages";
import { useChatScroll } from "./useChatScroll";

interface Geometry {
  scrollTop: number;
  extraHeight: number;
}

const resizeCallbacks: Array<() => void> = [];

beforeEach(() => {
  resizeCallbacks.length = 0;
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        resizeCallbacks.push(callback);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

const messages = (from: number, to: number): ChatMessage[] =>
  Array.from({ length: to - from + 1 }, (_, index) => ({
    id: from + index,
    senderId: 2,
    content: `메시지 ${from + index}`,
    createdAt: new Date(Date.UTC(2026, 9, 27, 0, 0, from + index)).toISOString(),
    attachments: [],
  }));

const Harness = ({
  items,
  geometry,
  setReading,
  isLoadingOlder = false,
}: {
  items: ChatMessage[];
  geometry: Geometry;
  setReading: (reading: boolean) => void;
  isLoadingOlder?: boolean;
}) => {
  const scroll = useChatScroll({ messages: items, outgoingCount: 0, isLoadingOlder, setReading });

  return (
    <>
      <button type="button" onClick={scroll.captureAnchor}>
        이전 기록 준비
      </button>
      <div
        data-testid="scroll-container"
        onScroll={scroll.onScroll}
        ref={(element) => {
          scroll.containerRef.current = element;
          if (!element) return;
          Object.defineProperties(element, {
            scrollHeight: { configurable: true, get: () => items.length * 100 + geometry.extraHeight },
            clientHeight: { configurable: true, get: () => 300 },
            scrollTop: {
              configurable: true,
              get: () => geometry.scrollTop,
              set: (value: number) => {
                geometry.scrollTop = Math.max(0, Math.min(value, items.length * 100 + geometry.extraHeight - 300));
              },
            },
          });
          element.getBoundingClientRect = () => new DOMRect(0, 0, 300, 300);
        }}
      >
        <div ref={scroll.contentRef}>
          {items.map((message, index) => (
            <div
              key={getMessageKey(message)}
              data-message-key={getMessageKey(message)}
              ref={(element) => {
                if (element)
                  element.getBoundingClientRect = () => new DOMRect(0, index * 100 - geometry.scrollTop, 300, 100);
              }}
            >
              {message.content}
            </div>
          ))}
        </div>
      </div>
      {scroll.hasNewMessages && (
        <button type="button" onClick={scroll.scrollToBottom}>
          새 메시지 보기
        </button>
      )}
    </>
  );
};

it("opens at the newest message and follows delayed content growth only while at the bottom", () => {
  const geometry = { scrollTop: 0, extraHeight: 0 };
  const setReading = vi.fn();
  const { unmount } = render(<Harness items={messages(1, 10)} geometry={geometry} setReading={setReading} />);
  expect(geometry.scrollTop).toBe(700);
  expect(setReading).toHaveBeenLastCalledWith(true);

  geometry.extraHeight = 150;
  act(() => {
    resizeCallbacks[0]();
  });
  expect(geometry.scrollTop).toBe(850);
  unmount();
  expect(setReading).toHaveBeenLastCalledWith(false);
});

it("preserves the history reader's position on new incoming messages and offers a jump to latest", () => {
  const geometry = { scrollTop: 0, extraHeight: 0 };
  const setReading = vi.fn();
  const { rerender } = render(<Harness items={messages(1, 10)} geometry={geometry} setReading={setReading} />);
  geometry.scrollTop = 200;
  fireEvent.scroll(screen.getByTestId("scroll-container"));
  expect(setReading).toHaveBeenLastCalledWith(false);

  rerender(<Harness items={messages(1, 11)} geometry={geometry} setReading={setReading} />);
  expect(geometry.scrollTop).toBe(200);
  expect(screen.getByRole("button", { name: "새 메시지 보기" })).toBeTruthy();
  geometry.extraHeight = 100;
  act(() => {
    resizeCallbacks[0]();
  });
  expect(geometry.scrollTop).toBe(200);

  fireEvent.click(screen.getByRole("button", { name: "새 메시지 보기" }));
  expect(geometry.scrollTop).toBe(900);
  expect(screen.queryByRole("button", { name: "새 메시지 보기" })).toBeNull();
  expect(setReading).toHaveBeenLastCalledWith(true);
});

it("keeps the same visible message offset when older history is prepended and releases its anchor afterwards", () => {
  const geometry = { scrollTop: 0, extraHeight: 0 };
  const setReading = vi.fn();
  const { rerender } = render(<Harness items={messages(11, 20)} geometry={geometry} setReading={setReading} />);
  geometry.scrollTop = 250;
  fireEvent.scroll(screen.getByTestId("scroll-container"));
  const offsetBefore = screen.getByText("메시지 13").getBoundingClientRect().top;
  fireEvent.click(screen.getByRole("button", { name: "이전 기록 준비" }));
  rerender(<Harness items={messages(11, 20)} geometry={geometry} setReading={setReading} isLoadingOlder />);
  expect(geometry.scrollTop).toBe(250);

  rerender(<Harness items={messages(1, 20)} geometry={geometry} setReading={setReading} />);
  expect(geometry.scrollTop).toBe(1250);
  expect(screen.getByText("메시지 13").getBoundingClientRect().top).toBe(offsetBefore);
  expect(screen.queryByRole("button", { name: "새 메시지 보기" })).toBeNull();

  rerender(<Harness items={messages(1, 21)} geometry={geometry} setReading={setReading} />);
  expect(geometry.scrollTop).toBe(1250);
  expect(screen.getByRole("button", { name: "새 메시지 보기" })).toBeTruthy();
});
