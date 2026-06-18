import { describe, expect, it } from "vitest";
import { findFieldByHeader, UNIV_APPLY_INFO_FIELDS } from "./univApplyInfoFields";

describe("univApplyInfoFields", () => {
	it("marks only Korean university name as always required", () => {
		const requiredFields = UNIV_APPLY_INFO_FIELDS.filter((field) => field.required).map((field) => field.field);

		expect(requiredFields).toEqual(["universityKoreanName"]);
	});

	it("matches supported field labels and whitespace variants", () => {
		expect(findFieldByHeader("국가 코드")).toBe("universityCountryCode");
		expect(findFieldByHeader("국가코드")).toBe("universityCountryCode");
		expect(findFieldByHeader("선발 인원")).toBe("studentCapacity");
		expect(findFieldByHeader("파견 가능 학기")).toBe("semesterAvailableForDispatch");
	});

	it("does not match unsupported headers that should be stored in extraInfo", () => {
		const extraInfoHeaders = ["등록금유형", "지원사항", "전공사항", "영어강좌", "비고", "표기명"];

		for (const header of extraInfoHeaders) {
			expect(findFieldByHeader(header)).toBeUndefined();
		}
	});
});
