import { beforeEach, describe, expect, it, vi } from "vitest";

const { post, put } = vi.hoisted(() => ({ post: vi.fn(), put: vi.fn() }));

vi.mock("@/lib/api/client", () => ({
	axiosInstance: {
		get: vi.fn(),
		post,
		put,
		patch: vi.fn(),
		delete: vi.fn(),
	},
}));

import { adminApi } from "./admin";

describe("admin host university multipart API", () => {
	beforeEach(() => {
		post.mockReset();
		put.mockReset();
	});

	it("createHostUniversity sends multipart/form-data with request JSON blob and files", async () => {
		post.mockResolvedValue({ data: { id: 1, koreanName: "테스트 대학교" } });
		const logoFile = new File(["logo"], "logo.png", { type: "image/png" });
		const backgroundFile = new File(["bg"], "bg.png", { type: "image/png" });
		const request = {
			koreanName: "테스트 대학교",
			englishName: "Test Univ",
			formatName: "Test U",
			countryCode: "JP",
			regionCode: "ASIA",
		};

		await adminApi.createHostUniversity(request, logoFile, backgroundFile);

		expect(post).toHaveBeenCalledWith("/admin/host-universities", expect.any(FormData));
		const formData = post.mock.calls[0]?.[1] as FormData;
		expect(formData.get("logoFile")).toBe(logoFile);
		expect(formData.get("backgroundFile")).toBe(backgroundFile);
		const requestBlob = formData.get("request") as Blob;
		expect(requestBlob.type).toBe("application/json");
	});

	it("updateHostUniversity sends multipart/form-data with optional files", async () => {
		put.mockResolvedValue({ data: { id: 1 } });
		const logoFile = new File(["logo"], "logo.png", { type: "image/png" });
		const request = {
			koreanName: "변경된 대학교",
			englishName: "Changed Univ",
			formatName: "Changed U",
			countryCode: "KR",
			regionCode: "ASIA",
		};

		await adminApi.updateHostUniversity(1, request, logoFile, null);

		expect(put).toHaveBeenCalledWith("/admin/host-universities/1", expect.any(FormData));
		const formData = put.mock.calls[0]?.[1] as FormData;
		expect(formData.get("logoFile")).toBe(logoFile);
		expect(formData.get("backgroundFile")).toBeNull();
	});

	it("updateHostUniversity omits both file parts when no files are provided", async () => {
		put.mockResolvedValue({ data: { id: 1 } });
		const request = {
			koreanName: "대학교",
			englishName: "University",
			formatName: "U",
			countryCode: "JP",
			regionCode: "ASIA",
		};

		await adminApi.updateHostUniversity(1, request);

		const formData = put.mock.calls[0]?.[1] as FormData;
		expect(formData.get("logoFile")).toBeNull();
		expect(formData.get("backgroundFile")).toBeNull();
	});
});
