import { beforeEach, describe, expect, it, vi } from "vitest";

const { create, loadAccessToken, post, removeAccessToken, requestInterceptors, saveAdminApiEnvironment } = vi.hoisted(
	() => {
		const hoistedPost = vi.fn();
		return {
			create: vi.fn(() => ({
				post: hoistedPost,
				interceptors: {
					request: {
						use: (fn: (config: Record<string, unknown>) => Record<string, unknown>) => {
							requestInterceptors.push(fn);
						},
					},
				},
			})),
			loadAccessToken: vi.fn(),
			post: hoistedPost,
			removeAccessToken: vi.fn(),
			requestInterceptors: [] as Array<(config: Record<string, unknown>) => Record<string, unknown>>,
			saveAdminApiEnvironment: vi.fn(),
		};
	},
);

vi.mock("axios", () => ({
	default: {
		create,
	},
}));

vi.mock("@/lib/auth/environment", () => ({
	getApiBaseUrlForEnvironment: (environment: string) =>
		environment === "dev" ? "https://api.stage.solid-connection.com" : "https://api.solid-connection.com",
	resolveEnvironmentFromEmail: (email: string) => (email.endsWith("@dev.solid-connection.com") ? "dev" : "prod"),
}));

vi.mock("@/lib/env", () => ({
	resolveActiveApiBaseUrl: () => "https://api.solid-connection.com",
}));

vi.mock("@/lib/utils/localStorage", () => ({
	loadAccessToken,
	removeAccessToken,
	saveAdminApiEnvironment,
}));

import { adminSignInApi, adminSignOutApi, reissueAccessTokenApi } from "./auth";

describe("어드민 인증 API", () => {
	beforeEach(() => {
		loadAccessToken.mockReset();
		post.mockReset();
		removeAccessToken.mockReset();
		saveAdminApiEnvironment.mockReset();
	});

	it("어드민 refresh token 쿠키를 주고받도록 credentials를 포함한다", () => {
		expect(create).toHaveBeenCalledWith({
			withCredentials: true,
		});
	});

	it("어드민 전용 로그인 API를 이메일 환경에 맞춰 호출한다", async () => {
		post.mockResolvedValue({ data: { accessToken: "access-token" } });

		await adminSignInApi("admin@dev.solid-connection.com", "password");

		expect(removeAccessToken).toHaveBeenCalledOnce();
		expect(saveAdminApiEnvironment).toHaveBeenCalledWith("dev");
		expect(post).toHaveBeenCalledWith(
			"/admin/auth/sign-in",
			{ email: "admin@dev.solid-connection.com", password: "password" },
			{ baseURL: "https://api.stage.solid-connection.com" },
		);
	});

	it("어드민 전용 재발급 API를 호출한다", async () => {
		post.mockResolvedValue({ data: { accessToken: "reissued-access-token" } });

		await reissueAccessTokenApi();

		expect(post).toHaveBeenCalledWith("/admin/auth/reissue");
	});

	it("어드민 전용 로그아웃 API에 access token을 전달한다", async () => {
		loadAccessToken.mockReturnValue("access-token");
		post.mockResolvedValue({ data: undefined });

		await adminSignOutApi();

		expect(post).toHaveBeenCalledWith("/admin/auth/sign-out", undefined, {
			headers: { Authorization: "Bearer access-token" },
		});
	});
});
