import { test as base, expect } from "@playwright/test";

export const apiURL = "http://127.0.0.1:43180";
export const test = base.extend({
  page: async ({ page, request }, use) => {
    await request.post(`${apiURL}/__reset`);
    // Local assets and fixture API only. Analytics and third-party SDKs are irrelevant here.
    await page.route("**/*", (route) => {
      const url = new URL(route.request().url());
      return url.hostname === "127.0.0.1" || url.protocol === "data:" || url.protocol === "blob:"
        ? route.continue()
        : route.abort();
    });
    await use(page);
    const state = await (await request.get(`${apiURL}/__state`)).json();
    expect(state.unexpected, "Every API request must have an explicit fixture contract").toEqual([]);
  },
});
export { expect };

export async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByPlaceholder("이메일", { exact: true }).fill("student@example.test");
  await page.getByPlaceholder("비밀번호", { exact: true }).fill("LocalTest123!");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page).toHaveURL("/");
}
export async function openChat(page: import("@playwright/test").Page) {
  await login(page);
  await page.goto("/mentor/chat/1");
  await expect(page.getByText("실시간으로 연결되어 있어요.")).toBeVisible();
  await expect(page.getByText("기존 메시지 45", { exact: true })).toBeVisible();
}
