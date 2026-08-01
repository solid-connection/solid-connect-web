import { describe, expect, it } from "vitest";
import { getApiBaseUrlForEnvironment, resolveEnvironmentFromEmail } from "./environment";

describe("resolveEnvironmentFromEmail", () => {
	it("dev 도메인 이메일은 dev 환경으로 판별한다", () => {
		expect(resolveEnvironmentFromEmail("admin@dev.solid-connection.com")).toBe("dev");
	});

	it("대소문자와 앞뒤 공백을 무시하고 판별한다", () => {
		expect(resolveEnvironmentFromEmail("  Admin@Dev.Solid-Connection.Com  ")).toBe("dev");
	});

	it("dev 도메인이 아닌 이메일은 prod 환경으로 판별한다", () => {
		expect(resolveEnvironmentFromEmail("admin@solid-connection.com")).toBe("prod");
	});

	it("dev 도메인을 부분 문자열로만 포함하는 이메일은 prod로 판별한다", () => {
		expect(resolveEnvironmentFromEmail("admin@notdev.solid-connection.com")).toBe("prod");
		expect(resolveEnvironmentFromEmail("admin@dev.solid-connection.com.evil.com")).toBe("prod");
	});
});

describe("getApiBaseUrlForEnvironment", () => {
	it("환경에 맞는 API base URL을 반환한다", () => {
		expect(getApiBaseUrlForEnvironment("dev")).toBe("https://api.stage.solid-connection.com");
		expect(getApiBaseUrlForEnvironment("prod")).toBe("https://api.solid-connection.com");
	});
});
