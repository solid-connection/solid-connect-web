export const UNIV_APPLY_INFO_FIELDS = [
	{ field: "universityKoreanName", label: "대학명 (국문)", required: true, aliases: ["대학명", "학교명", "대학교명"] },
	{ field: "universityEnglishName", label: "대학명 (영문)", required: true, aliases: ["영문명", "영어명"] },
	{ field: "universityCountryCode", label: "국가", required: true, aliases: ["국가코드"] },
	{ field: "studentCapacity", label: "선발 인원", required: true, aliases: ["인원", "모집인원", "정원", "모집정원"] },
	{
		field: "semesterAvailableForDispatch",
		label: "파견 가능 학기",
		required: true,
		aliases: ["파견가능학기", "파견학기"],
	},
	{ field: "semesterRequirement", label: "최저 이수학기", required: true, aliases: ["학기요건", "재학학기"] },
	{ field: "gpaRequirement", label: "최저 성적 요건", required: true, aliases: ["성적요건", "학점요건", "최소학점"] },
	{ field: "gpaRequirementCriteria", label: "성적 기준", required: true, aliases: ["학점기준", "성적기준"] },
	{
		field: "detailsForLanguage",
		label: "어학 세부 요건",
		required: true,
		aliases: ["어학사항", "어학요건상세", "어학요건"],
	},
	{ field: "detailsForAccommodation", label: "기숙사", required: true, aliases: ["숙소사항", "기숙사안내"] },
	{
		field: "universityHomepageUrl",
		label: "관련 홈페이지",
		required: false,
		aliases: ["홈페이지", "대학홈페이지", "관련홈페이지"],
	},
] as const;

export type UnivApplyInfoFieldName = (typeof UNIV_APPLY_INFO_FIELDS)[number]["field"];

function normalizeHeader(header: string): string {
	return header.replace(/\s+/g, "").trim();
}

export function findFieldByHeader(header: string): UnivApplyInfoFieldName | undefined {
	const normalizedHeader = normalizeHeader(header);
	const matched = UNIV_APPLY_INFO_FIELDS.find((f) => {
		const candidates = [f.field, f.label, ...f.aliases];
		return candidates.some((candidate) => candidate === header || normalizeHeader(candidate) === normalizedHeader);
	});
	return matched?.field;
}
