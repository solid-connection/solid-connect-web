import { afterEach, describe, expect, it } from "vitest";

import { loadAccessToken, removeAccessToken, saveAccessToken } from "./localStorage";

const ADMIN_ACCESS_TOKEN_KEY = "adminAccessToken";

describe("어드민 access token localStorage 저장", () => {
	afterEach(() => {
		localStorage.clear();
	});

	it("어드민 전용 키(adminAccessToken)로 저장한다", () => {
		saveAccessToken("access-token");

		expect(localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY)).toBe("access-token");
	});

	it("어드민 전용 키(adminAccessToken)에서 조회한다", () => {
		localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, "access-token");

		expect(loadAccessToken()).toBe("access-token");
	});

	it("어드민 전용 키(adminAccessToken)를 제거한다", () => {
		localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, "access-token");

		removeAccessToken();

		expect(localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY)).toBeNull();
	});

	it("웹 앱의 레거시 accessToken 키는 더 이상 사용하지 않는다", () => {
		saveAccessToken("access-token");

		expect(localStorage.getItem("accessToken")).toBeNull();
	});
});
