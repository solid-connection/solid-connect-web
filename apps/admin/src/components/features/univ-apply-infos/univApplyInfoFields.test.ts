import { describe, expect, it } from "vitest";
import { findFieldByHeader, UNIV_APPLY_INFO_FIELDS } from "./univApplyInfoFields";

describe("univApplyInfoFields", () => {
	it("contains only required system fields", () => {
		expect(UNIV_APPLY_INFO_FIELDS.every((field) => field.required)).toBe(true);
	});

	it("does not match optional headers that should be stored in extraInfo", () => {
		const extraInfoHeaders = ["등록금유형", "지원사항", "전공사항", "영어강좌", "비고", "표기명"];

		for (const header of extraInfoHeaders) {
			expect(findFieldByHeader(header)).toBeUndefined();
		}
	});
});
