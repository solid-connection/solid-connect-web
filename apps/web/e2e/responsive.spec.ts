import { expect, login, openChat, test } from "./fixtures/test";

const widths = [390, 767, 768, 1024, 1280, 1440, 1536];
async function noHorizontalOverflow(page: import("@playwright/test").Page) {
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
    .toBeLessThanOrEqual(1);
}

test("홈 탐색과 카드가 앱과 웹 경계에서 겹치거나 잘리지 않는다", async ({ page }) => {
  await page.goto("/");
  for (const width of widths) {
    await test.step(`${width}px`, async () => {
      await page.setViewportSize({ width, height: 1000 });
      const desktop = page.getByRole("navigation", { name: "주요 메뉴", includeHidden: true });
      const bottom = page.getByRole("navigation", { name: "하단 메뉴", includeHidden: true });
      if (width >= 768) {
        await expect(desktop).toBeVisible();
        await expect(bottom).toBeHidden();
      } else {
        await expect(desktop).toBeHidden();
        await expect(bottom).toBeVisible();
      }
      await expect(page.getByRole("link", { name: "학교 검색하기", exact: true })).toBeVisible();
      await noHorizontalOverflow(page);
      if (width < 768) {
        const card = page.getByRole("link", {
          name: "매우 긴 이름의 국제 교환학생 파견 프로그램을 운영하는 테스트 대학교",
          exact: true,
        });
        const cardBox = (await card.boundingBox())!;
        const arrow = (await card.locator("svg").last().boundingBox())!;
        expect(arrow.x + arrow.width).toBeLessThanOrEqual(cardBox.x + cardBox.width);
      }
      if (width >= 768) {
        const cards = page.locator('a[href="/university/inha/1"]');
        await expect(cards.first()).toBeVisible();
        expect((await cards.first().boundingBox())!.width).toBeGreaterThanOrEqual(220);
      }
      if ([390, 768, 1440].includes(width))
        await page.screenshot({ caret: "initial", path: test.info().outputPath(`home-${width}.png`), fullPage: true });
    });
  }
});

test("767와 768 경계를 넘어도 학교와 어학 및 국가 조건을 보존한다", async ({ page }) => {
  await page.setViewportSize({ width: 767, height: 1000 });
  await page.goto("/");
  const form = page.getByRole("region", { name: "파견학교 검색" });
  await form.getByRole("button", { name: "경희대", exact: true }).click();
  await form.getByRole("button", { name: /어학.*선택/ }).click();
  await page.getByRole("button", { name: "인터넷 기반 영어 시험 (TOEFL iBT)", exact: true }).click();
  await form
    .getByRole("button", { name: /관심있는 나라.*나라/ })
    .first()
    .click();
  await page.getByRole("button", { name: "독일", exact: true }).click();
  const search = page.getByRole("link", { name: "학교 검색하기", exact: true });
  const href = await search.getAttribute("href");
  expect(href).toContain("/university/kyunghee?");
  for (const width of [768, 1440, 390, 767]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(search).toHaveAttribute("href", href!);
    await expect(form.getByRole("button", { name: "경희대", exact: true })).toHaveAttribute("aria-pressed", "true");
  }
  await search.click();
  await expect(page).toHaveURL(href!);
  await noHorizontalOverflow(page);
});

test("대학 목록에서 폭을 바꾸고 검색과 빈 결과 및 초기화를 처리한다", async ({ page }) => {
  await page.goto("/university/inha");
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(page.getByRole("link").filter({ hasText: "매우 긴 이름의 국제" }).first()).toBeVisible();
    await noHorizontalOverflow(page);
    if ([390, 768, 1440].includes(width))
      await page.screenshot({ caret: "initial", path: test.info().outputPath(`catalog-${width}.png`) });
  }
  const search = page.getByPlaceholder("학교명 또는 국가 검색").filter({ visible: true });
  await search.fill("아무 결과도 없는 검색어");
  await expect(page.getByText("검색 결과가 없습니다.", { exact: true }).filter({ visible: true })).toBeVisible();
  await search.fill("");
  await expect(page.getByRole("link").filter({ hasText: "매우 긴 이름의 국제" }).first()).toBeVisible();
});

test("로그인 입력이 화면 전환에도 유지되고 로그인을 완료한다", async ({ page }) => {
  await page.setViewportSize({ width: 767, height: 1000 });
  await page.goto("/login");
  await page.getByPlaceholder("이메일", { exact: true }).fill("student@example.test");
  await page.getByPlaceholder("비밀번호", { exact: true }).fill("LocalTest123!");
  for (const width of [768, 1024, 1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(page.getByPlaceholder("이메일", { exact: true })).toHaveValue("student@example.test");
    await expect(page.getByPlaceholder("비밀번호", { exact: true })).toHaveValue("LocalTest123!");
    await noHorizontalOverflow(page);
    if (width === 1440)
      await page.screenshot({ caret: "initial", path: test.info().outputPath(`login-${width}.png`), fullPage: true });
  }
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page).toHaveURL("/");
});

test("채팅 작성기와 참여자 탐색이 모든 폭에서 화면 안에 있다", async ({ page }) => {
  await openChat(page);
  const input = page.getByRole("textbox", { name: "메시지", exact: true });
  await input.fill("화면을 바꿔도 보존할 초안");
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(input).toHaveValue("화면을 바꿔도 보존할 초안");
    await expect(page.getByText("참여자", { exact: true })).toBeVisible();
    const composer = (await page.getByRole("form", { name: "채팅 메시지 작성" }).boundingBox())!;
    expect(composer.x).toBeGreaterThanOrEqual(0);
    expect(composer.x + composer.width).toBeLessThanOrEqual(width);
    expect(composer.y + composer.height).toBeLessThanOrEqual(1000);
    await noHorizontalOverflow(page);
    if ([390, 768, 1440].includes(width))
      await page.screenshot({ caret: "initial", path: test.info().outputPath(`chat-${width}.png`), fullPage: true });
  }
  await page.getByRole("button", { name: "메시지 보내기" }).click();
  await expect(page.locator("[data-message-key]").filter({ hasText: "화면을 바꿔도 보존할 초안" })).toHaveCount(1);
});

test("마이페이지의 프로필과 작업 메뉴가 앱과 웹에서 접근 가능하다", async ({ page }) => {
  await login(page);
  await page.goto("/my");
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(page.getByText(/테스트 학생/).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "공인 어학 / 학점 변경", exact: true })).toBeVisible();
    await noHorizontalOverflow(page);
    if ([390, 1440].includes(width))
      await page.screenshot({ caret: "initial", path: test.info().outputPath(`my-${width}.png`), fullPage: true });
  }
});
