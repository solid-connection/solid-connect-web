const homes = ["인하대학교", "경희대학교", "중앙대학교"];
export const universities = homes.flatMap((homeUniversityName, homeIndex) =>
  Array.from({ length: 48 }, (_, index) => ({
    id: homeIndex * 100 + index + 1,
    homeUniversityName,
    term: "2027-1",
    koreanName:
      index === 0
        ? "매우 긴 이름의 국제 교환학생 파견 프로그램을 운영하는 테스트 대학교"
        : `테스트 파견대학교 ${index + 1}`,
    englishName: `Test University ${index + 1}`,
    country: index % 2 === 0 ? "독일" : "미국",
    region: index % 2 === 0 ? "유럽권" : "미주권",
    logoImageUrl: "/svgs/placeholders/university-logo-placeholder.svg",
    backgroundImageUrl: "/svgs/placeholders/university-background-placeholder.svg",
    studentCapacity: (index % 5) + 1,
    languageRequirements: [
      { languageTestType: "TOEFL_IBT", minScore: "80" },
      { languageTestType: "IELTS", minScore: "6.0" },
      { languageTestType: "TOEIC", minScore: "800" },
    ],
  })),
);
export function searchUniversities(params) {
  const home = Number(params.get("homeUniversityId"));
  const query = params.get("value") ?? "";
  return universities.filter(
    (university) =>
      (!home || university.homeUniversityName === homes[home - 1]) && university.koreanName.includes(query),
  );
}
export function universityDetail(id) {
  const university = universities.find((item) => item.id === id);
  if (!university) return null;
  return {
    ...university,
    formatName: university.englishName,
    homepageUrl: "https://example.test",
    detailsForLocal: "예시 지역 안내",
    tuitionFeeType: "HOME_UNIVERSITY",
    semesterAvailableForDispatch: "1학기",
    detailsForLanguage: "어학 성적을 제출해주세요.",
    gpaRequirement: "3.0",
    gpaRequirementCriteria: "4.5",
    semesterRequirement: "2학기",
    detailsForApply: "예시 지원 조건",
    detailsForMajor: "전공별 조건을 확인해주세요.",
    detailsForAccommodation: "기숙사 안내",
    accommodationUrl: "https://example.test/accommodation",
    detailsForEnglishCourse: "영어 강의 안내",
    englishCourseUrl: "https://example.test/courses",
    details: "예시 대학 정보",
  };
}
