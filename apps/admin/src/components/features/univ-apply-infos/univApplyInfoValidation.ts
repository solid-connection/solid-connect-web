import { isValidCountryCode } from "./countryCodeAliases";
import type { PreviewRow } from "./univApplyInfoPreview";

const TUITION_FEE_TYPES = ["HOME_UNIVERSITY_PAYMENT", "OVERSEAS_UNIVERSITY_PAYMENT", "MIXED_PAYMENT"] as const;

const SEMESTER_AVAILABLE_FOR_DISPATCH_VALUES = [
	"ONE_SEMESTER",
	"TWO_SEMESTER",
	"FOUR_SEMESTER",
	"ONE_OR_TWO_SEMESTER",
	"ONE_YEAR",
	"IRRELEVANT",
	"NO_DATA",
] as const;

type FieldRule =
	| { type: "required"; message: string }
	| { type: "maxLength"; max: number }
	| { type: "integer"; message: string }
	| { type: "enum"; values: readonly string[]; label: string }
	| { type: "format"; check: (v: string) => boolean; message: string };

const FIELD_RULES: Record<string, FieldRule[]> = {
	universityKoreanName: [
		{ type: "required", message: "대학명은 필수입니다" },
		{ type: "maxLength", max: 100 },
	],
	universityEnglishName: [{ type: "maxLength", max: 100 }],
	universityFormatName: [{ type: "maxLength", max: 100 }],
	universityHomepageUrl: [{ type: "maxLength", max: 500 }],
	universityEnglishCourseUrl: [{ type: "maxLength", max: 500 }],
	universityAccommodationUrl: [{ type: "maxLength", max: 500 }],
	universityDetailsForLocal: [{ type: "maxLength", max: 1000 }],
	studentCapacity: [{ type: "integer", message: "선발 인원은 정수여야 합니다" }],
	tuitionFeeType: [{ type: "enum", values: TUITION_FEE_TYPES, label: "등록금 유형" }],
	semesterAvailableForDispatch: [
		{
			type: "enum",
			values: SEMESTER_AVAILABLE_FOR_DISPATCH_VALUES,
			label: "파견 가능 학기",
		},
	],
	semesterRequirement: [{ type: "maxLength", max: 100 }],
	gpaRequirement: [{ type: "maxLength", max: 100 }],
	gpaRequirementCriteria: [{ type: "maxLength", max: 100 }],
	detailsForLanguage: [{ type: "maxLength", max: 1000 }],
	detailsForApply: [{ type: "maxLength", max: 1000 }],
	detailsForMajor: [{ type: "maxLength", max: 1000 }],
	detailsForAccommodation: [{ type: "maxLength", max: 1000 }],
	detailsForEnglishCourse: [{ type: "maxLength", max: 1000 }],
	details: [{ type: "maxLength", max: 1000 }],
	universityCountryCode: [
		{
			type: "format",
			check: isValidCountryCode,
			message: "유효하지 않은 국가 코드입니다",
		},
	],
};

function validateCell(value: string, rules: FieldRule[]): string | undefined {
	for (const rule of rules) {
		const trimmed = value.trim();

		if (rule.type === "required") {
			if (!trimmed) return rule.message;
			continue;
		}

		if (!trimmed) continue;

		if (rule.type === "maxLength") {
			if (trimmed.length > rule.max) {
				return `값이 최대 길이(${rule.max}자)를 초과했습니다: ${trimmed.length}자`;
			}
		} else if (rule.type === "integer") {
			if (!/^\d+$/.test(trimmed)) {
				return `${rule.message}: '${value}'`;
			}
		} else if (rule.type === "enum") {
			if (!rule.values.includes(trimmed)) {
				return `유효하지 않은 ${rule.label}입니다. 가능한 값: ${rule.values.join(", ")}`;
			}
		} else if (rule.type === "format") {
			if (!rule.check(trimmed)) {
				return rule.message;
			}
		}
	}
	return undefined;
}

export function validatePreviewRows(rows: PreviewRow[]): Map<string, string> {
	const errors = new Map<string, string>();

	for (const row of rows) {
		for (const [field, cell] of Object.entries(row.cellsByField)) {
			const rules = FIELD_RULES[field];
			if (!rules) continue;
			const message = validateCell(cell.value, rules);
			if (message) {
				errors.set(`${row.rowNumber}:field:${field}`, message);
			}
		}
	}

	return errors;
}

export function mergeErrorMaps(...maps: Map<string, string>[]): Map<string, string> {
	const merged = new Map<string, string>();
	for (const map of maps) {
		for (const [key, value] of map) {
			merged.set(key, value);
		}
	}
	return merged;
}
