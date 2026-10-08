import { beforeEach, describe, expect, it, vi } from "vitest";

const { removeAccessToken } = vi.hoisted(() => ({
	removeAccessToken: vi.fn(),
}));

vi.mock("@/lib/api/auth", () => ({
	reissueAccessTokenApi: vi.fn(),
}));

// 환경(stage/prod) 저장·조회 함수는 실제 구현(jsdom localStorage)을 그대로 사용해,
// clearSession()이 저장된 환경 값을 건드리지 않는지 회귀 테스트로 검증한다.
vi.mock("@/lib/utils/localStorage", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/lib/utils/localStorage")>();
	return {
		...actual,
		loadAccessToken: vi.fn(),
		removeAccessToken,
		saveAccessToken: vi.fn(),
	};
});

describe("switchAdminApiEnvironment", () => {
	beforeEach(() => {
		removeAccessToken.mockReset();
		localStorage.clear();
	});

	it("access token을 지운 뒤 새 환경을 저장하고 로그인 페이지로 리다이렉트한다", async () => {
		const { switchAdminApiEnvironment } = await import("./session");
		const { loadAdminApiEnvironment } = await import("@/lib/utils/localStorage");
		const redirect = vi.fn();

		switchAdminApiEnvironment("prod", redirect);

		expect(removeAccessToken).toHaveBeenCalledOnce();
		expect(loadAdminApiEnvironment()).toBe("prod");
		expect(redirect).toHaveBeenCalledWith("/auth/login");
	});
});

describe("clearSession", () => {
	beforeEach(() => {
		removeAccessToken.mockReset();
		localStorage.clear();
	});

	it("access token은 지우지만 저장된 어드민 API 환경 값은 유지한다 (회귀 테스트)", async () => {
		const { clearSession } = await import("./session");
		const { loadAdminApiEnvironment, saveAdminApiEnvironment } = await import("@/lib/utils/localStorage");

		saveAdminApiEnvironment("stage");

		clearSession();

		expect(removeAccessToken).toHaveBeenCalledOnce();
		expect(loadAdminApiEnvironment()).toBe("stage");
	});
});
