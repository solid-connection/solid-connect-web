export const UNIV_APPLY_INFO_FIELDS = [
	{ field: "universityKoreanName", label: "대학명 (국문)", required: true, aliases: ["대학명", "학교명", "대학교명"] },
	{ field: "universityEnglishName", label: "대학명 (영문)", required: true, aliases: ["영문명", "영어명"] },
	{ field: "universityFormatName", label: "대학 표기명", required: false, aliases: ["표기명"] },
	{ field: "universityCountryCode", label: "국가 코드", required: true, aliases: ["국가코드", "국가"] },
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
	{ field: "detailsForLanguage", label: "어학 요건", required: true, aliases: ["어학사항", "어학요건상세"] },
	{ field: "detailsForAccommodation", label: "기숙사", required: true, aliases: ["숙소사항", "기숙사안내"] },
	{ field: "tuitionFeeType", label: "등록금 유형", required: false, aliases: ["등록금유형", "수업료유형"] },
	{ field: "detailsForApply", label: "지원 사항", required: false, aliases: ["지원사항", "지원안내"] },
	{ field: "detailsForMajor", label: "지원 전공", required: false, aliases: ["전공사항", "전공안내"] },
	{ field: "detailsForEnglishCourse", label: "영어 강좌", required: false, aliases: ["영어강좌", "영어강의"] },
	{ field: "details", label: "비고", required: false, aliases: ["기타사항", "비고"] },
] as const;

export type UnivApplyInfoFieldName = (typeof UNIV_APPLY_INFO_FIELDS)[number]["field"];

export function findFieldByHeader(header: string): UnivApplyInfoFieldName | undefined {
	const matched = UNIV_APPLY_INFO_FIELDS.find(
		(f) => f.field === header || (f.aliases as readonly string[]).includes(header),
	);
	return matched?.field;
}
