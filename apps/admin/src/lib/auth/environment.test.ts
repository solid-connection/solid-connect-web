import { describe, expect, it } from "vitest";
import { getApiBaseUrlForEnvironment } from "./environment";

describe("getApiBaseUrlForEnvironment", () => {
	it("환경에 맞는 API base URL을 반환한다", () => {
		expect(getApiBaseUrlForEnvironment("stage")).toBe("https://api.stage.solid-connection.com");
		expect(getApiBaseUrlForEnvironment("prod")).toBe("https://api.solid-connection.com");
	});
});
