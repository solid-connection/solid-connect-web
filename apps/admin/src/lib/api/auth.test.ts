import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { post, requestInterceptors } = vi.hoisted(() => ({
	post: vi.fn().mockResolvedValue({ data: { accessToken: "token" } }),
	requestInterceptors: [] as Array<(config: Record<string, unknown>) => Record<string, unknown>>,
}));

vi.mock("axios", () => ({
	default: {
		create: () => ({
			post,
			interceptors: {
				request: {
					use: (fn: (config: Record<string, unknown>) => Record<string, unknown>) => {
						requestInterceptors.push(fn);
					},
				},
			},
		}),
	},
}));

describe("adminSignInApi", () => {
	beforeEach(() => {
		post.mockClear();
		localStorage.clear();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("dev 이메일 로그인 요청은 localStorage 저장 성공 여부와 무관하게 stage baseURL로 전송된다", async () => {
		const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
			throw new Error("storage unavailable");
		});

		const { adminSignInApi } = await import("./auth");
		await adminSignInApi("dev@solid-connection.com", "password");

		expect(post).toHaveBeenCalledWith(
			"/auth/email/sign-in",
			{ email: "dev@solid-connection.com", password: "password" },
			{ baseURL: "https://api.stage.solid-connection.com" },
		);

		setItemSpy.mockRestore();
	});

	it("prod 이메일 로그인 요청은 prod baseURL로 전송된다", async () => {
		const { adminSignInApi } = await import("./auth");
		await adminSignInApi("admin@solid-connection.com", "password");

		expect(post).toHaveBeenCalledWith(
			"/auth/email/sign-in",
			{ email: "admin@solid-connection.com", password: "password" },
			{ baseURL: "https://api.solid-connection.com" },
		);
	});
});
