import { describe, expect, it } from "vitest";
import { getApiBaseUrlForEnvironment, resolveEnvironmentFromEmail } from "./environment";

describe("resolveEnvironmentFromEmail", () => {
	it("dev 계정 이메일(dev@solid-connection.com)은 dev 환경으로 판별한다", () => {
		expect(resolveEnvironmentFromEmail("dev@solid-connection.com")).toBe("dev");
	});

	it("대소문자와 앞뒤 공백을 무시하고 판별한다", () => {
		expect(resolveEnvironmentFromEmail("  Dev@Solid-Connection.Com  ")).toBe("dev");
	});

	it("dev 계정 이메일이 아닌 이메일은 prod 환경으로 판별한다", () => {
		expect(resolveEnvironmentFromEmail("admin@solid-connection.com")).toBe("prod");
	});

	it("로컬파트가 dev로 시작하지만 정확히 일치하지 않는 이메일은 prod로 판별한다", () => {
		expect(resolveEnvironmentFromEmail("dev2@solid-connection.com")).toBe("prod");
		expect(resolveEnvironmentFromEmail("dev@notsolid-connection.com")).toBe("prod");
	});
});

describe("getApiBaseUrlForEnvironment", () => {
	it("환경에 맞는 API base URL을 반환한다", () => {
		expect(getApiBaseUrlForEnvironment("dev")).toBe("https://api.stage.solid-connection.com");
		expect(getApiBaseUrlForEnvironment("prod")).toBe("https://api.solid-connection.com");
	});
});
