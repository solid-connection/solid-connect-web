import { beforeEach, describe, expect, it, vi } from "vitest";

const { post } = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock("@/lib/api/client", () => ({
	axiosInstance: {
		get: vi.fn(),
		post,
		put: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	},
}));

import { adminApi } from "./admin";

describe("admin university image uploads", () => {
	beforeEach(() => {
		post.mockReset();
	});

	it.each([
		["logo", "/file/admin/university/logo"],
		["background", "/file/admin/university/background"],
	] as const)("uploads the %s with formatName under the existing englishName wire key", async (kind, endpoint) => {
		post.mockResolvedValue({ data: { fileUrl: `admin/${kind}/image.webp` } });
		const file = new File(["image"], `${kind}.png`, { type: "image/png" });

		const result =
			kind === "logo"
				? await adminApi.uploadAdminUniversityLogo(file, "university_of_test")
				: await adminApi.uploadAdminUniversityBackground(file, "university_of_test");

		expect(post).toHaveBeenCalledWith(endpoint, expect.any(FormData), {
			headers: { "Content-Type": "multipart/form-data" },
		});
		const formData = post.mock.calls[0]?.[1] as FormData;
		expect(formData.get("file")).toBe(file);
		expect(formData.get("englishName")).toBe("university_of_test");
		expect(result).toEqual({ fileUrl: `admin/${kind}/image.webp` });
	});
});
