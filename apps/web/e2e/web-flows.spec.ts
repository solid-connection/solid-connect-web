import { apiURL, expect, login, test } from "./fixtures/test";

test("홈에서 학교 검색 링크와 준비중 안내를 제공한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "파견 학교 찾기" })).toBeVisible();
  await expect(page.getByRole("link").filter({ hasText: "학교 검색" }).first()).toHaveAttribute(
    "href",
    "/university/inha",
  );
  await page.getByRole("button", { name: /작년도 합격 점수 확인하러 가기/ }).click();
  await expect(page.getByText("해당 기능은 현재 준비중입니다.")).toBeVisible();
});

test("이메일 로그인 실패 후 입력을 수정해 로그인하고 마이페이지를 연다", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("이메일", { exact: true }).fill("student@example.test");
  await page.getByPlaceholder("비밀번호", { exact: true }).fill("wrong-password");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page.getByText("이메일 또는 비밀번호를 확인해주세요.")).toBeVisible();
  await expect(page.getByPlaceholder("이메일", { exact: true })).toHaveValue("student@example.test");
  await page.getByPlaceholder("비밀번호", { exact: true }).fill("LocalTest123!");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "마이 페이지로 이동", exact: true }).click();
  await expect(page).toHaveURL("/my");
  await expect(page.getByText("테스트 학생님은")).toBeVisible();
});

for (const path of ["/my", "/mentor"]) {
  test(`비회원의 ${path} 진입은 로그인으로 안내한다`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveURL("/login");
    await expect(page.getByPlaceholder("이메일", { exact: true })).toBeVisible();
  });
}

test("비회원 채팅은 로그인 링크만 제공하고 채팅 API를 호출하지 않는다", async ({ page, request }) => {
  await page.goto("/mentor/chat/1");
  await expect(page.getByText("채팅하려면 로그인이 필요해요.")).toBeVisible();
  await expect(page.getByRole("link", { name: "로그인하기", exact: true })).toHaveAttribute("href", "/login");
  await expect(page.getByRole("form", { name: "채팅 메시지 작성" })).toHaveCount(0);
  expect((await (await request.get(`${apiURL}/__state`)).json()).reads).toBe(0);
});

test("커뮤니티에서 글쓰기를 누르면 로그인 후 원래 작성 화면으로 돌아온다", async ({ page }) => {
  await page.goto("/community");
  await expect(page).toHaveURL("/community/FREE");
  await expect(page.getByText("교환학생 준비 질문", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "글쓰기", exact: true }).click();
  await expect(page).toHaveURL(/\/login\?redirect=/);
  await page.getByPlaceholder("이메일", { exact: true }).fill("student@example.test");
  await page.getByPlaceholder("비밀번호", { exact: true }).fill("LocalTest123!");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page).toHaveURL("/community/FREE/create");
  await expect(page.getByPlaceholder("제목을 입력하세요")).toBeVisible();
});

test("성적 화면에서 공인어학과 학점 탭을 전환하고 입력으로 이동한다", async ({ page }) => {
  await login(page);
  await page.goto("/university/score");
  await expect(page.getByText("아직 등록된 성적이 없어요.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "학점", exact: true }).click();
  await expect(page.getByRole("button", { name: "학점 입력하기" })).toBeVisible();
  await page.getByRole("button", { name: "공인어학", exact: true }).click();
  await page.getByRole("button", { name: "어학 성적 입력하기" }).click();
  await expect(page).toHaveURL("/university/score/submit/language-test");
});

test("비회원 지원자 현황에서 로그인으로 이동한다", async ({ page }) => {
  await page.goto("/university/application");
  await expect(page.getByText("로그인하고 지금 바로 경쟁률을 확인하세요.")).toBeVisible();
  await page.getByRole("link", { name: "로그인하러가기" }).click();
  await expect(page).toHaveURL("/login");
});

test("약관과 잘못된 채팅방 주소를 안전하게 표시한다", async ({ page }) => {
  await page.goto("/terms");
  await expect(page.getByText("제1조 (목적)", { exact: true })).toBeVisible();
  await page.goto("/mentor/chat/not-a-number");
  await expect(page.getByText("존재하지 않는 페이지입니다", { exact: true })).toBeVisible();
  await expect(page.getByRole("form", { name: "채팅 메시지 작성" })).toHaveCount(0);
});

test("로그아웃 후에는 개인 채팅 기록에 다시 접근할 수 없다", async ({ page }) => {
  await login(page);
  await page.goto("/my");
  await expect(page.getByText("테스트 학생님은")).toBeVisible();
  await page.getByRole("button", { name: "로그아웃", exact: true }).click();
  await expect(page).toHaveURL("/");
  await page.goto("/mentor/chat/1");
  await expect(page.getByText("채팅하려면 로그인이 필요해요.")).toBeVisible();
  await expect(page.locator("[data-message-key]")).toHaveCount(0);
});
