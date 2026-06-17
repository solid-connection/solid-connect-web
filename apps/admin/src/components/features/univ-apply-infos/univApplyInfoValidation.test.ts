import { describe, expect, it } from "vitest";
import type { PreviewRow } from "./univApplyInfoPreview";
import { mergeErrorMaps, validatePreviewRows } from "./univApplyInfoValidation";

function makeRow(rowNumber: number, cells: Record<string, string>): PreviewRow {
	return {
		rowNumber,
		cellsByField: Object.fromEntries(
			Object.entries(cells).map(([field, value]) => [field, { header: field, field, value }]),
		),
	};
}

describe("validatePreviewRows", () => {
	it("유효한 행에는 에러를 반환하지 않는다", () => {
		const rows = [
			makeRow(1, {
				universityKoreanName: "괌 대학교",
				studentCapacity: "3",
				universityCountryCode: "US",
				tuitionFeeType: "HOME_UNIVERSITY_PAYMENT",
				semesterAvailableForDispatch: "ONE_SEMESTER",
			}),
		];
		expect(validatePreviewRows(rows).size).toBe(0);
	});

	it("universityKoreanName이 빈 값이면 REQUIRED 에러를 반환한다", () => {
		const rows = [makeRow(1, { universityKoreanName: "" })];
		const errors = validatePreviewRows(rows);
		expect(errors.get("1:field:universityKoreanName")).toBe("대학명은 필수입니다");
	});

	it("universityKoreanName이 공백만 있어도 REQUIRED 에러를 반환한다", () => {
		const rows = [makeRow(1, { universityKoreanName: "   " })];
		const errors = validatePreviewRows(rows);
		expect(errors.get("1:field:universityKoreanName")).toBe("대학명은 필수입니다");
	});

	it("universityKoreanName이 100자를 초과하면 TOO_LONG 에러를 반환한다", () => {
		const rows = [makeRow(1, { universityKoreanName: "가".repeat(101) })];
		const errors = validatePreviewRows(rows);
		expect(errors.get("1:field:universityKoreanName")).toContain("100자");
	});

	it("studentCapacity가 정수가 아니면 에러를 반환한다", () => {
		const rows = [makeRow(1, { studentCapacity: "School of Business" })];
		const errors = validatePreviewRows(rows);
		expect(errors.get("1:field:studentCapacity")).toContain("정수여야 합니다");
	});

	it("studentCapacity가 빈 값이면 에러를 반환하지 않는다", () => {
		const rows = [makeRow(1, { studentCapacity: "" })];
		expect(validatePreviewRows(rows).size).toBe(0);
	});

	it("studentCapacity가 유효한 정수이면 에러를 반환하지 않는다", () => {
		const rows = [makeRow(1, { studentCapacity: "5" })];
		expect(validatePreviewRows(rows).size).toBe(0);
	});

	it("tuitionFeeType이 허용되지 않은 값이면 에러를 반환한다", () => {
		const rows = [makeRow(1, { tuitionFeeType: "INVALID_TYPE" })];
		const errors = validatePreviewRows(rows);
		expect(errors.get("1:field:tuitionFeeType")).toContain("HOME_UNIVERSITY_PAYMENT");
	});

	it("tuitionFeeType이 유효한 값이면 에러를 반환하지 않는다", () => {
		const rows = [makeRow(1, { tuitionFeeType: "OVERSEAS_UNIVERSITY_PAYMENT" })];
		expect(validatePreviewRows(rows).size).toBe(0);
	});

	it("tuitionFeeType이 빈 값이면 에러를 반환하지 않는다", () => {
		const rows = [makeRow(1, { tuitionFeeType: "" })];
		expect(validatePreviewRows(rows).size).toBe(0);
	});

	it("semesterAvailableForDispatch가 허용되지 않은 값이면 에러를 반환한다", () => {
		const rows = [makeRow(1, { semesterAvailableForDispatch: "UNKNOWN" })];
		const errors = validatePreviewRows(rows);
		expect(errors.get("1:field:semesterAvailableForDispatch")).toContain("ONE_SEMESTER");
	});

	it("semesterAvailableForDispatch가 유효한 값이면 에러를 반환하지 않는다", () => {
		const rows = [makeRow(1, { semesterAvailableForDispatch: "TWO_SEMESTER" })];
		expect(validatePreviewRows(rows).size).toBe(0);
	});

	it("universityCountryCode가 2자리 대문자가 아니면 에러를 반환한다", () => {
		const rows = [makeRow(1, { universityCountryCode: "Belgium" })];
		const errors = validatePreviewRows(rows);
		expect(errors.get("1:field:universityCountryCode")).toBe("유효하지 않은 국가 코드입니다");
	});

	it("universityCountryCode가 유효한 2자리 대문자면 에러를 반환하지 않는다", () => {
		const rows = [makeRow(1, { universityCountryCode: "BE" })];
		expect(validatePreviewRows(rows).size).toBe(0);
	});

	it("universityCountryCode가 빈 값이면 에러를 반환하지 않는다", () => {
		const rows = [makeRow(1, { universityCountryCode: "" })];
		expect(validatePreviewRows(rows).size).toBe(0);
	});

	it("semesterRequirement가 100자를 초과하면 에러를 반환한다", () => {
		const rows = [makeRow(1, { semesterRequirement: "a".repeat(101) })];
		const errors = validatePreviewRows(rows);
		expect(errors.get("1:field:semesterRequirement")).toContain("100자");
	});

	it("details 계열 필드가 1000자를 초과하면 에러를 반환한다", () => {
		const rows = [makeRow(1, { detailsForAccommodation: "a".repeat(1001) })];
		const errors = validatePreviewRows(rows);
		expect(errors.get("1:field:detailsForAccommodation")).toContain("1000자");
	});

	it("알 수 없는 필드는 무시한다", () => {
		const rows = [makeRow(1, { TOEIC: "800" })];
		expect(validatePreviewRows(rows).size).toBe(0);
	});

	it("한 행에 복수 에러가 있으면 모두 수집한다", () => {
		const rows = [
			makeRow(1, {
				universityKoreanName: "",
				studentCapacity: "not-a-number",
				universityCountryCode: "Belgium",
			}),
		];
		const errors = validatePreviewRows(rows);
		expect(errors.size).toBe(3);
	});

	it("여러 행에 걸쳐 에러를 각각 수집한다", () => {
		const rows = [makeRow(1, { studentCapacity: "abc" }), makeRow(2, { studentCapacity: "xyz" })];
		const errors = validatePreviewRows(rows);
		expect(errors.has("1:field:studentCapacity")).toBe(true);
		expect(errors.has("2:field:studentCapacity")).toBe(true);
	});
});

describe("mergeErrorMaps", () => {
	it("두 맵을 병합한다", () => {
		const a = new Map([["1:field:foo", "에러A"]]);
		const b = new Map([["2:field:bar", "에러B"]]);
		const merged = mergeErrorMaps(a, b);
		expect(merged.size).toBe(2);
		expect(merged.get("1:field:foo")).toBe("에러A");
		expect(merged.get("2:field:bar")).toBe("에러B");
	});

	it("같은 키는 나중 맵 값으로 덮어쓴다", () => {
		const a = new Map([["1:field:foo", "에러A"]]);
		const b = new Map([["1:field:foo", "에러B"]]);
		const merged = mergeErrorMaps(a, b);
		expect(merged.get("1:field:foo")).toBe("에러B");
	});

	it("빈 맵을 병합하면 다른 맵과 동일하다", () => {
		const a = new Map([["1:field:foo", "에러A"]]);
		const merged = mergeErrorMaps(a, new Map());
		expect(merged.size).toBe(1);
	});
});
