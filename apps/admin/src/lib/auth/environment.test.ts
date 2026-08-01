import { beforeEach, describe, expect, it, vi } from "vitest";
import { getApiBaseUrlForEnvironment } from "./environment";

describe("getApiBaseUrlForEnvironment", () => {
	it("환경에 맞는 API base URL을 반환한다", () => {
		expect(getApiBaseUrlForEnvironment("stage")).toBe("https://api.stage.solid-connection.com");
		expect(getApiBaseUrlForEnvironment("prod")).toBe("https://api.solid-connection.com");
	});
});

const { removeAccessToken, removeAdminApiEnvironment, saveAdminApiEnvironment } = vi.hoisted(() => ({
	removeAccessToken: vi.fn(),
	removeAdminApiEnvironment: vi.fn(),
	saveAdminApiEnvironment: vi.fn(),
}));

vi.mock("@/lib/api/auth", () => ({
	reissueAccessTokenApi: vi.fn(),
}));

vi.mock("@/lib/utils/localStorage", () => ({
	loadAccessToken: vi.fn(),
	removeAccessToken,
	removeAdminApiEnvironment,
	saveAccessToken: vi.fn(),
	saveAdminApiEnvironment,
}));

describe("switchAdminApiEnvironment", () => {
	beforeEach(() => {
		removeAccessToken.mockReset();
		removeAdminApiEnvironment.mockReset();
		saveAdminApiEnvironment.mockReset();
	});

	it("세션(access token, 환경 값)을 모두 지운 뒤 새 환경을 저장한다", async () => {
		const { switchAdminApiEnvironment } = await import("./session");
		const redirect = vi.fn();
		const callOrder: string[] = [];

		removeAdminApiEnvironment.mockImplementation(() => callOrder.push("removeAdminApiEnvironment"));
		saveAdminApiEnvironment.mockImplementation(() => callOrder.push("saveAdminApiEnvironment"));

		switchAdminApiEnvironment("prod", redirect);

		expect(removeAccessToken).toHaveBeenCalledOnce();
		expect(removeAdminApiEnvironment).toHaveBeenCalledOnce();
		expect(saveAdminApiEnvironment).toHaveBeenCalledWith("prod");
		expect(callOrder).toEqual(["removeAdminApiEnvironment", "saveAdminApiEnvironment"]);
		expect(redirect).toHaveBeenCalledWith("/auth/login");
	});
});
