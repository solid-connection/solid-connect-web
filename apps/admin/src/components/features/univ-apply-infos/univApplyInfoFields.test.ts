import { describe, expect, it } from "vitest";
import { findFieldByHeader, UNIV_APPLY_INFO_FIELDS } from "./univApplyInfoFields";

describe("univApplyInfoFields", () => {
	it("contains only required system fields", () => {
		expect(UNIV_APPLY_INFO_FIELDS.every((field) => field.required)).toBe(true);
	});

	it("matches required field labels and whitespace variants", () => {
		expect(findFieldByHeader("국가 코드")).toBe("universityCountryCode");
		expect(findFieldByHeader("국가코드")).toBe("universityCountryCode");
		expect(findFieldByHeader("선발 인원")).toBe("studentCapacity");
		expect(findFieldByHeader("파견 가능 학기")).toBe("semesterAvailableForDispatch");
	});

	it("does not match optional headers that should be stored in extraInfo", () => {
		const extraInfoHeaders = ["등록금유형", "지원사항", "전공사항", "영어강좌", "비고", "표기명"];

		for (const header of extraInfoHeaders) {
			expect(findFieldByHeader(header)).toBeUndefined();
		}
	});
});
