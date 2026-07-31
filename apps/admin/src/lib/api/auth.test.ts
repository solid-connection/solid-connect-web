import { beforeEach, describe, expect, it, vi } from "vitest";

const { create, loadAccessToken, post } = vi.hoisted(() => {
	const hoistedPost = vi.fn();
	return {
		create: vi.fn(() => ({ post: hoistedPost })),
		loadAccessToken: vi.fn(),
		post: hoistedPost,
	};
});

vi.mock("axios", () => ({
	default: {
		create,
	},
}));

vi.mock("@/lib/env", () => ({
	createMissingAdminApiServerUrlError: () => new Error("API server URL is required"),
	getAdminApiServerUrl: () => "https://api.example.com",
}));

vi.mock("@/lib/utils/localStorage", () => ({
	loadAccessToken,
}));

import { adminSignInApi, adminSignOutApi, reissueAccessTokenApi } from "./auth";

describe("어드민 인증 API", () => {
	beforeEach(() => {
		loadAccessToken.mockReset();
		post.mockReset();
	});

	it("어드민 refresh token 쿠키를 주고받도록 credentials를 포함한다", () => {
		expect(create).toHaveBeenCalledWith({
			baseURL: "https://api.example.com",
			withCredentials: true,
		});
	});

	it("어드민 전용 로그인 API를 호출한다", async () => {
		post.mockResolvedValue({ data: { accessToken: "access-token" } });

		await adminSignInApi("admin@example.com", "password");

		expect(post).toHaveBeenCalledWith("/admin/auth/sign-in", {
			email: "admin@example.com",
			password: "password",
		});
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
