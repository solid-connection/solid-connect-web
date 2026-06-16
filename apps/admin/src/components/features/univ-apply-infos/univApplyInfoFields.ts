export const UNIV_APPLY_INFO_FIELDS = [
	{ field: "universityKoreanName", label: "대학 한국어명", aliases: ["대학명", "학교명", "대학교명"] },
	{ field: "universityEnglishName", label: "대학 영어명", aliases: ["영문명", "영어명"] },
	{ field: "universityFormatName", label: "대학 표기명", aliases: ["표기명"] },
	{ field: "universityBackgroundImageUrl", label: "배경 이미지 URL", aliases: ["배경이미지URL", "배경이미지"] },
	{ field: "universityLogoImageUrl", label: "로고 이미지 URL", aliases: ["로고이미지URL", "로고이미지"] },
	{ field: "universityCountryCode", label: "국가 코드", aliases: ["국가코드"] },
	{ field: "universityRegionCode", label: "권역 코드", aliases: ["권역코드"] },
	{ field: "studentCapacity", label: "모집 인원", aliases: ["인원", "모집인원", "정원", "모집정원"] },
	{ field: "tuitionFeeType", label: "등록금 유형", aliases: ["등록금유형", "수업료유형"] },
	{ field: "semesterAvailableForDispatch", label: "파견 가능 학기", aliases: ["파견가능학기", "파견학기"] },
	{ field: "semesterRequirement", label: "학기 요건", aliases: ["학기요건", "재학학기"] },
	{ field: "detailsForLanguage", label: "어학 사항", aliases: ["어학사항", "어학요건상세"] },
	{ field: "gpaRequirement", label: "성적 요건", aliases: ["성적요건", "학점요건", "최소학점"] },
	{ field: "gpaRequirementCriteria", label: "학점 기준", aliases: ["학점기준", "성적기준"] },
	{ field: "detailsForApply", label: "지원 사항", aliases: ["지원사항", "지원안내"] },
	{ field: "detailsForMajor", label: "전공 사항", aliases: ["전공사항", "전공안내"] },
	{ field: "detailsForAccommodation", label: "숙소 사항", aliases: ["숙소사항", "기숙사안내"] },
	{ field: "detailsForEnglishCourse", label: "영어 강좌", aliases: ["영어강좌", "영어강의"] },
	{ field: "details", label: "기타 사항", aliases: ["기타사항", "비고"] },
] as const;

export type UnivApplyInfoFieldName = (typeof UNIV_APPLY_INFO_FIELDS)[number]["field"];

export function findFieldByHeader(header: string): UnivApplyInfoFieldName | undefined {
	const matched = UNIV_APPLY_INFO_FIELDS.find(
		(f) => f.field === header || (f.aliases as readonly string[]).includes(header),
	);
	return matched?.field;
}
