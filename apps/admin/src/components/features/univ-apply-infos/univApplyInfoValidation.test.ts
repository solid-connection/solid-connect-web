import { describe, expect, it } from "vitest";
import type { PreviewRow } from "./univApplyInfoPreview";
import { validatePreviewRows } from "./univApplyInfoValidation";

function makeRow(cellsByField: PreviewRow["cellsByField"]): PreviewRow {
	return {
		rowNumber: 1,
		cellsByField,
	};
}

describe("validatePreviewRows", () => {
	it("requires Korean university name for every preview row", () => {
		const rows = [
			makeRow({
				universityKoreanName: {
					header: "대학명 (국문)",
					field: "universityKoreanName",
					value: "   ",
				},
			}),
		];

		const errors = validatePreviewRows(rows);

		expect(errors.get("1:field:universityKoreanName")).toContain("필수");
	});

	it("does not require conditional or nullable fields when they are not mapped", () => {
		const rows = [
			makeRow({
				universityKoreanName: {
					header: "대학명 (국문)",
					field: "universityKoreanName",
					value: "괌 대학",
				},
			}),
		];

		const errors = validatePreviewRows(rows);

		expect(errors.size).toBe(0);
	});

	it("does not require optional mapped field values or language test scores", () => {
		const rows = [
			makeRow({
				universityKoreanName: {
					header: "대학명 (국문)",
					field: "universityKoreanName",
					value: "괌 대학",
				},
				universityEnglishName: {
					header: "대학명 (영문)",
					field: "universityEnglishName",
					value: "",
				},
				universityCountryCode: {
					header: "국가",
					field: "universityCountryCode",
					value: "",
				},
				studentCapacity: {
					header: "선발 인원",
					field: "studentCapacity",
					value: "",
				},
				TOEIC: {
					header: "TOEIC",
					field: "TOEIC",
					value: "",
				},
			}),
		];

		const errors = validatePreviewRows(rows);

		expect(errors.size).toBe(0);
	});

	it("validates optional field constraints when values are present", () => {
		const rows = [
			makeRow({
				universityKoreanName: {
					header: "대학명 (국문)",
					field: "universityKoreanName",
					value: "괌 대학",
				},
				universityCountryCode: {
					header: "국가",
					field: "universityCountryCode",
					value: "없는 국가",
				},
				studentCapacity: {
					header: "선발 인원",
					field: "studentCapacity",
					value: "두 명",
				},
			}),
		];

		const errors = validatePreviewRows(rows);

		expect(errors.get("1:field:universityCountryCode")).toContain("유효하지 않은 국가 코드");
		expect(errors.get("1:field:studentCapacity")).toContain("정수");
	});
});
