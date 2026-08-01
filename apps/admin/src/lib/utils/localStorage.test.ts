import { afterEach, describe, expect, it } from "vitest";

import {
	loadAccessToken,
	loadAdminApiEnvironment,
	removeAccessToken,
	removeAdminApiEnvironment,
	saveAccessToken,
	saveAdminApiEnvironment,
} from "./localStorage";

const ADMIN_ACCESS_TOKEN_KEY = "adminAccessToken";
const ADMIN_API_ENVIRONMENT_KEY = "adminApiEnvironment";

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

describe("어드민 API 환경 localStorage 저장", () => {
	afterEach(() => {
		localStorage.clear();
	});

	it("환경 값을 저장하고 조회한다", () => {
		saveAdminApiEnvironment("prod");

		expect(loadAdminApiEnvironment()).toBe("prod");
	});

	it("환경 값을 제거한다", () => {
		saveAdminApiEnvironment("stage");

		removeAdminApiEnvironment();

		expect(loadAdminApiEnvironment()).toBeNull();
	});

	it("레거시 값 'dev'는 'stage'로 해석한다", () => {
		localStorage.setItem(ADMIN_API_ENVIRONMENT_KEY, "dev");

		expect(loadAdminApiEnvironment()).toBe("stage");
	});

	it("알 수 없는 값은 null을 반환한다", () => {
		localStorage.setItem(ADMIN_API_ENVIRONMENT_KEY, "unknown");

		expect(loadAdminApiEnvironment()).toBeNull();
	});
});
