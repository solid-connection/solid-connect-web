import { describe, expect, it } from "vitest";
import { buildFailedCellMessages, buildPreviewRows, getPreviewCellError } from "./univApplyInfoPreview";

describe("univApplyInfoPreview", () => {
	it("matches server cell errors to preview cells by row number and original header", () => {
		const markdown = `
| 대학명 | 국가코드 |
|--------|----------|
|  | Belgium |
`;
		const columnMappings = {
			대학명: "universityKoreanName",
			국가코드: "universityCountryCode",
		};
		const rows = buildPreviewRows(markdown, columnMappings);
		const failedCellMessages = buildFailedCellMessages({
			successCount: 0,
			createdUniversities: [],
			failedRows: [
				{
					rowNumber: 1,
					reason: "2개 컬럼에 문제가 있습니다.",
					errors: [
						{
							header: "대학명",
							field: "universityKoreanName",
							value: null,
							code: "REQUIRED",
							message: "대학명(universityKoreanName) 컬럼이 매핑되지 않았습니다",
						},
						{
							header: "국가코드",
							field: "universityCountryCode",
							value: "Belgium",
							code: "NOT_FOUND",
							message: "국가를 찾을 수 없습니다.",
						},
					],
				},
			],
		});

		expect(rows[0]?.cellsByField.universityCountryCode?.value).toBe("Belgium");
		expect(getPreviewCellError(failedCellMessages, rows[0], "universityCountryCode")).toBe("국가를 찾을 수 없습니다.");
	});

	it("matches server cell errors when the original header is a required field label", () => {
		const markdown = `
| 대학명 (국문) | 국가 코드 |
|--------------|-----------|
|  | Belgium |
`;
		const columnMappings = {
			"대학명 (국문)": "universityKoreanName",
			"국가 코드": "universityCountryCode",
		};
		const rows = buildPreviewRows(markdown, columnMappings);
		const failedCellMessages = buildFailedCellMessages({
			successCount: 0,
			createdUniversities: [],
			failedRows: [
				{
					rowNumber: 1,
					reason: "2개 컬럼에 문제가 있습니다.",
					errors: [
						{
							header: "국가 코드",
							field: "universityCountryCode",
							value: "Belgium",
							code: "NOT_FOUND",
							message: "국가를 찾을 수 없습니다.",
						},
					],
				},
			],
		});

		expect(rows[0]?.cellsByField.universityCountryCode?.value).toBe("Belgium");
		expect(getPreviewCellError(failedCellMessages, rows[0], "universityCountryCode")).toBe("국가를 찾을 수 없습니다.");
	});
});
