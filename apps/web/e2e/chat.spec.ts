import { apiURL, expect, login, openChat, test } from "./fixtures/test";

test("채팅 기록과 텍스트 전송을 합치고 중복 없이 새로고침 후 유지한다", async ({ page, request }) => {
  await openChat(page);
  await page.getByRole("textbox", { name: "메시지", exact: true }).fill("안녕하세요 멘토님");
  await page.getByRole("button", { name: "메시지 보내기" }).click();
  await expect(page.locator("[data-message-key]").filter({ hasText: "안녕하세요 멘토님" })).toHaveCount(1);
  await expect(page.getByRole("textbox", { name: "메시지", exact: true })).toHaveValue("");
  await expect.poll(async () => (await (await request.get(`${apiURL}/__state`)).json()).sends.length).toBe(1);
  await page.reload();
  await expect(page.locator("[data-message-key]").filter({ hasText: "안녕하세요 멘토님" })).toHaveCount(1);
});

test("이전 기록을 추가할 때 읽던 위치를 유지한다", async ({ page }) => {
  await openChat(page);
  const region = page.getByRole("region", { name: "채팅 메시지", exact: true });
  await region.evaluate((element) => {
    element.scrollTop = 0;
  });
  const anchor = page.locator("[data-message-key]").first();
  const key = await anchor.getAttribute("data-message-key");
  const before = (await anchor.boundingBox())!.y;
  await page.getByRole("button", { name: "이전 메시지 더 보기" }).click();
  await expect(page.locator("[data-message-key]")).toHaveCount(40);
  await expect
    .poll(async () => Math.abs((await page.locator(`[data-message-key="${key}"]`).boundingBox())!.y - before))
    .toBeLessThan(5);
});

test("연결 중단 중 초안을 지키고 여러 페이지의 누락 메시지를 복구한다", async ({ page, request }) => {
  await openChat(page);
  const input = page.getByRole("textbox", { name: "메시지", exact: true });
  await input.fill("연결 후 보낼 초안");
  await request.post(`${apiURL}/__control`, { data: { paused: true } });
  await expect(page.getByRole("button", { name: "메시지 보내기" })).toBeDisabled();
  await request.post(`${apiURL}/__control`, { data: { push: 45 } });
  await request.post(`${apiURL}/__control`, { data: { paused: false } });
  await page.getByRole("button", { name: "다시 연결", exact: true }).click();
  await expect(page.getByText("실시간으로 연결되어 있어요.")).toBeVisible();
  await expect(page.locator("[data-message-key]")).toHaveCount(65);
  for (let index = 1; index <= 45; index++)
    await expect(page.getByText(`복구 메시지 ${index}`, { exact: true })).toHaveCount(1);
  await expect(input).toHaveValue("연결 후 보낼 초안");
  expect((await (await request.get(`${apiURL}/__state`)).json()).sends).toHaveLength(0);
});

test("이미지 업로드 실패 후 선택과 텍스트를 유지하고 재시도한다", async ({ page, request }) => {
  await openChat(page);
  await page.getByRole("textbox", { name: "메시지", exact: true }).fill("별도로 보낼 텍스트");
  await page.getByLabel("채팅 이미지 선택").setInputFiles({
    name: "campus.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await request.post(`${apiURL}/__control`, { data: { failUpload: true } });
  await page.getByRole("button", { name: "이미지 1장 보내기" }).click();
  await expect(page.getByRole("list", { name: "선택한 이미지" })).toBeVisible();
  await expect(page.getByRole("alert").filter({ hasText: "입력 내용" })).toBeVisible();
  await request.post(`${apiURL}/__control`, { data: { failUpload: false } });
  await page.getByRole("button", { name: "이미지 1장 보내기" }).click();
  await expect(page.getByRole("list", { name: "선택한 이미지" })).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "메시지", exact: true })).toHaveValue("별도로 보낼 텍스트");
  await expect(page.locator("[data-message-key]").getByAltText("첨부 이미지")).toHaveCount(1);
  const state = await (await request.get(`${apiURL}/__state`)).json();
  expect(state.uploads).toBe(2);
  expect(state.sends).toHaveLength(1);
});

test("목록 조회 실패를 재시도로 복구하고 다른 방으로 이동한다", async ({ page, request }) => {
  await openChat(page);
  await request.post(`${apiURL}/__control`, { data: { failRooms: true } });
  await page.goto("/mentor/chat");
  await expect(page.getByText("채팅 목록을 불러오지 못했어요.")).toBeVisible({ timeout: 20_000 });
  await request.post(`${apiURL}/__control`, { data: { failRooms: false } });
  await page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await page.getByRole("link").filter({ hasText: "두번째 멘토" }).click();
  await expect(page).toHaveURL("/mentor/chat/2");
  await expect(page.getByText("아직 대화가 없어요. 첫 메시지를 보내보세요.")).toBeVisible();
  await expect(page.locator("[data-message-key]")).toHaveCount(0);
});

test("접근 권한이 없으면 메시지와 전송을 막는다", async ({ page, request }) => {
  await openChat(page);
  await request.post(`${apiURL}/__control`, { data: { denied: true } });
  await page.reload();
  await expect(page.getByText("이 채팅방에 접근할 수 없습니다.")).toBeVisible();
  await expect(page.locator("[data-message-key]")).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "메시지", exact: true })).toBeDisabled();
});

test("좁은 화면에서도 작성 영역과 전송 버튼이 화면 안에 있다", async ({ page }) => {
  await openChat(page);
  const composer = page.getByRole("form", { name: "채팅 메시지 작성" });
  const box = (await composer.boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("기록 조회 실패에서 재시도하면 전송 가능한 상태로 복구한다", async ({ page, request }) => {
  await login(page);
  await request.post(`${apiURL}/__control`, { data: { failHistory: true } });
  await page.goto("/mentor/chat/1");
  // Connecting also synchronizes history. Finish that attempt before enabling recovery.
  await expect(page.getByText("실시간으로 연결되어 있어요.")).toBeVisible();
  await expect(page.getByRole("region", { name: "채팅 메시지", exact: true }).getByRole("alert")).toBeVisible();
  await expect(page.getByRole("button", { name: "메시지 보내기" })).toBeDisabled();
  await request.post(`${apiURL}/__control`, { data: { failHistory: false } });
  await page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await expect(page.getByText("기존 메시지 45", { exact: true })).toBeVisible();
  await page.getByRole("textbox", { name: "메시지", exact: true }).fill("복구 후 전송");
  await expect(page.getByRole("button", { name: "메시지 보내기" })).toBeEnabled();
});

test("기록 조회보다 늦게 도착한 소켓 응답도 전송을 한 번만 확인한다", async ({ page, request }) => {
  await openChat(page);
  await request.post(`${apiURL}/__control`, { data: { echo: false } });
  await page.getByRole("textbox", { name: "메시지", exact: true }).fill("기록이 먼저 도착한 전송");
  await page.getByRole("button", { name: "메시지 보내기" }).click();
  await expect.poll(async () => (await (await request.get(`${apiURL}/__state`)).json()).sends.length).toBe(1);
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.locator("[data-message-key]").filter({ hasText: "기록이 먼저 도착한 전송" })).toHaveCount(1);
  await expect(page.getByText("전송 확인 중…", { exact: true })).toBeVisible();
  await request.post(`${apiURL}/__control`, { data: { flushEcho: true } });
  await expect(page.getByText("전송 확인 중…", { exact: true })).toHaveCount(0);
  await expect(page.getByText("기록이 먼저 도착한 전송", { exact: true })).toHaveCount(1);
});

test("토큰 갱신의 일시 장애에서 초안과 선택 이미지를 보존하고 재연결한다", async ({ page, request }) => {
  await openChat(page);
  const input = page.getByRole("textbox", { name: "메시지", exact: true });
  await input.fill("갱신 중에도 보존할 초안");
  await page
    .getByLabel("채팅 이미지 선택")
    .setInputFiles({ name: "draft.png", mimeType: "image/png", buffer: Buffer.from("image") });
  await page.clock.setFixedTime(new Date("2100-01-01T00:00:01Z"));
  await request.post(`${apiURL}/__control`, { data: { paused: true, reissueStatus: 503 } });
  await expect(page.getByRole("button", { name: "다시 연결", exact: true })).toBeVisible();
  await request.post(`${apiURL}/__control`, { data: { paused: false } });
  await page.getByRole("button", { name: "다시 연결", exact: true }).click();
  await expect(page.getByText("채팅에 연결하지 못했어요. 다시 연결해주세요.")).toBeVisible();
  await expect(input).toHaveValue("갱신 중에도 보존할 초안");
  await expect(page.getByRole("list", { name: "선택한 이미지" })).toBeVisible();
  await expect(page).toHaveURL("/mentor/chat/1");
  await request.post(`${apiURL}/__control`, { data: { reissueStatus: 200 } });
  await page.getByRole("button", { name: "다시 연결", exact: true }).click();
  await expect(page.getByText("실시간으로 연결되어 있어요.")).toBeVisible();
  await expect(input).toHaveValue("갱신 중에도 보존할 초안");
  await expect(page.getByRole("list", { name: "선택한 이미지" })).toBeVisible();
  expect((await (await request.get(`${apiURL}/__state`)).json()).refreshes).toBeGreaterThanOrEqual(2);
});
