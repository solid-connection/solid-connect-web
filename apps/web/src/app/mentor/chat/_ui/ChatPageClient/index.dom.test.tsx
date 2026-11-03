// @vitest-environment jsdom
import { fireEvent, render, screen, within } from "@testing-library/react/pure";
import type { ComponentProps, ReactNode } from "react";
import { beforeEach, expect, it, vi } from "vitest";
import { type ChatRoom, useGetChatRooms } from "@/apis/chat";
import type { UserRole } from "@/types/mentor";
import ChatPageClient from ".";

const mocks = vi.hoisted(() => ({
  userId: 1 as number | null,
  role: "MENTEE" as UserRole,
  query: {
    data: undefined as ChatRoom[] | undefined,
    isPending: true,
    isError: false,
    isFetching: false,
    refetch: vi.fn(),
  },
}));

vi.mock("@/apis/chat", () => ({ useGetChatRooms: vi.fn(() => mocks.query) }));
vi.mock("@/lib/zustand/useAuthStore", () => ({
  default: (selector: (state: { clientRole: UserRole; serverRole: UserRole }) => unknown) =>
    selector({ clientRole: mocks.role, serverRole: mocks.role }),
}));
vi.mock("../ChatAccess", () => ({
  default: ({ children }: { children: (userId: number) => ReactNode }) =>
    mocks.userId === null ? <p>로그인이 필요해요.</p> : children(mocks.userId),
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: ComponentProps<"a"> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
vi.mock("@/components/ui/ProfileWithBadge", () => ({ default: () => <span /> }));
vi.mock("@/public/svgs/mentor", () => ({ IconSearchBlue: () => <span />, IconSolidConnentionLogo: () => <span /> }));

beforeEach(() => {
  mocks.userId = 1;
  mocks.role = "MENTEE" as UserRole;
  Object.assign(mocks.query, { data: undefined, isPending: true, isError: false, isFetching: false });
  mocks.query.refetch.mockReset();
  vi.mocked(useGetChatRooms).mockClear();
});

const room = (id: number, lastReceivedTime: string): ChatRoom => ({
  id,
  lastReceivedTime,
  lastChatMessage: `메시지 ${id}`,
  unReadCount: id === 2 ? 12 : 0,
  partner: { partnerId: id + 100, nickname: `상대방 ${id}`, profileUrl: null, university: null },
});

it("separates loading, initial failure and successful role-specific empty states", () => {
  const { rerender } = render(<ChatPageClient />);
  expect(screen.getByRole("status").textContent).toContain("불러오고 있어요");
  expect(screen.queryByText(/현재 매칭된 멘토가 없어요/)).toBeNull();

  Object.assign(mocks.query, { isPending: false, isError: true });
  rerender(<ChatPageClient />);
  expect(screen.getByRole("alert").textContent).toContain("불러오지 못했어요");
  fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));
  expect(mocks.query.refetch).toHaveBeenCalledTimes(1);

  Object.assign(mocks.query, { data: [], isError: false });
  rerender(<ChatPageClient />);
  expect(screen.getByText(/현재 매칭된 멘토가 없어요/)).toBeTruthy();
  expect(screen.getByRole("link", { name: "멘토 찾으러 가볼까요?" }).getAttribute("href")).toBe("/mentor");

  mocks.role = "MENTOR" as UserRole;
  rerender(<ChatPageClient />);
  expect(screen.getByText("현재 진행 중인 채팅이 없어요.")).toBeTruthy();
  expect(screen.queryByRole("link", { name: "멘토 찾으러 가볼까요?" })).toBeNull();
});

it("sorts a clone by recent valid dates and retains room links and unread counts", () => {
  const rooms = [room(1, "2026-10-25T00:00:00Z"), room(3, "invalid-date"), room(2, "2026-10-27T00:00:00Z")];
  Object.freeze(rooms);
  Object.assign(mocks.query, { data: rooms, isPending: false });
  render(<ChatPageClient />);
  const list = screen.getByRole("list", { name: "채팅방" });
  const links = within(list).getAllByRole("link");
  expect(links.map((link) => link.getAttribute("href"))).toEqual([
    "/mentor/chat/2",
    "/mentor/chat/1",
    "/mentor/chat/3",
  ]);
  expect(rooms.map((item) => item.id)).toEqual([1, 3, 2]);
  expect(list.querySelectorAll("time")).toHaveLength(2);
  expect(screen.getByText("안 읽은 메시지 12개")).toBeTruthy();
  expect(screen.getByText("9+")).toBeTruthy();
});

it("keeps the previous list during refresh and reports a failed refresh with retry", () => {
  Object.assign(mocks.query, { data: [room(1, "2026-10-27T00:00:00Z")], isPending: false, isFetching: true });
  const { rerender } = render(<ChatPageClient />);
  expect(screen.getByRole("status").textContent).toContain("업데이트");
  expect(screen.getByRole("list", { name: "채팅방" })).toBeTruthy();

  Object.assign(mocks.query, { isError: true, isFetching: false });
  rerender(<ChatPageClient />);
  expect(screen.getByRole("alert").textContent).toContain("이전 목록을 표시하고 있어요");
  expect(
    within(screen.getByRole("list", { name: "채팅방" }))
      .getByRole("link")
      .getAttribute("href"),
  ).toBe("/mentor/chat/1");
  fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));
  expect(mocks.query.refetch).toHaveBeenCalledTimes(1);
});

it("does not mount the private room query before ChatAccess authorizes a user", () => {
  mocks.userId = null;
  const { rerender } = render(<ChatPageClient />);
  expect(screen.getByText("로그인이 필요해요.")).toBeTruthy();
  expect(useGetChatRooms).not.toHaveBeenCalled();

  mocks.userId = 2;
  Object.assign(mocks.query, { data: [room(2, "2026-10-27T00:00:00Z")], isPending: false });
  rerender(<ChatPageClient />);
  expect(screen.getByRole("list", { name: "채팅방" })).toBeTruthy();
  expect(useGetChatRooms).toHaveBeenCalledExactlyOnceWith(2);
});
