import { describe, expect, it } from "vitest";
import { normalizeTermName } from "./termValidation";

describe("normalizeTermName", () => {
	it("trims and accepts YYYY-N term names", () => {
		expect(normalizeTermName(" 2026-1 ")).toBe("2026-1");
	});

	it.each(["", "2026", "26-1", "2026-10"])("rejects %s", (value) => {
		expect(normalizeTermName(value)).toBeNull();
	});
});
