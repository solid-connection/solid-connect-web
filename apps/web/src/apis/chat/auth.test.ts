import { beforeEach, describe, expect, it, vi } from "vitest";
import { getChatUserId } from "./auth";

const token = (sub: unknown, exp: unknown = Math.floor(Date.now() / 1000) + 60) =>
  `header.${btoa(JSON.stringify({ sub, exp }))}.signature`;

describe("getChatUserId", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {});
  });

  it("uses the same user identity for numeric and string JWT subjects", () => {
    expect(getChatUserId(token(42))).toBe(42);
    expect(getChatUserId(token("42"))).toBe(42);
  });

  it.each([
    undefined,
    null,
    "",
    0,
    -1,
    1.5,
    "invalid",
    true,
    [1],
    Number.MAX_SAFE_INTEGER + 1,
  ])("does not enable personal chat data for an invalid subject: %j", (sub) => {
    expect(getChatUserId(token(sub))).toBeNull();
  });

  it("rejects missing and expired tokens including the exact expiry boundary", () => {
    expect(getChatUserId(null)).toBeNull();
    expect(getChatUserId("invalid")).toBeNull();
    expect(getChatUserId(token(42, Math.floor(Date.now() / 1000)))).toBeNull();
    expect(getChatUserId(token(42, "9999999999"))).toBeNull();
  });
});
