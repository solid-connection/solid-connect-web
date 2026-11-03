// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react/pure";
import type { ReactNode } from "react";
import { expect, it, vi } from "vitest";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { chatApi } from "./api";
import useGetPartnerInfo from "./getChatPartner";
import useGetChatRooms from "./getChatRooms";
import { chatKeys } from "./queryKeys";

vi.mock("./api", () => ({ chatApi: { getChatPartner: vi.fn(), getChatRooms: vi.fn() } }));

it("retains authorized partner and room query identities across token expiry and rotation", async () => {
  const token = (exp: number) => `header.${btoa(JSON.stringify({ sub: 7, role: "MENTEE", exp }))}.signature`;
  useAuthStore.getState().setAccessToken(token(Math.floor(Date.now() / 1000) + 3600));
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const partner = { partnerId: 8, nickname: "상대방", profileUrl: null, university: null };
  const rooms = { chatRooms: [] };
  client.setQueryData(chatKeys.partner(7, 42), partner);
  client.setQueryData(chatKeys.rooms(7), rooms);
  vi.mocked(chatApi.getChatRooms).mockResolvedValue(rooms);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const { result, rerender, unmount } = renderHook(
    () => ({ partner: useGetPartnerInfo(42, 7), rooms: useGetChatRooms(7) }),
    { wrapper },
  );
  await waitFor(() => expect(result.current.rooms.isFetching).toBe(false));
  act(() =>
    useAuthStore.setState({ accessToken: token(Math.floor(Date.now() / 1000) - 1), refreshStatus: "retryable" }),
  );
  rerender();
  expect(result.current.partner.isSuccess).toBe(true);
  expect(result.current.partner.data).toEqual(partner);
  expect(result.current.rooms.isSuccess).toBe(true);
  expect(
    client
      .getQueryCache()
      .getAll()
      .every((query) => query.queryKey[1] === 7),
  ).toBe(true);
  expect(chatApi.getChatPartner).not.toHaveBeenCalled();
  act(() =>
    useAuthStore
      .getState()
      .setRefreshedAccessToken(token(Math.floor(Date.now() / 1000) + 3600), useAuthStore.getState().sessionVersion),
  );
  rerender();
  expect(result.current.partner.data).toEqual(partner);
  expect(result.current.rooms.data).toEqual([]);
  unmount();
  client.clear();
  useAuthStore.getState().clearAccessToken();
});
