import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import CollegeCards from "@/components/college/list/college-cards";

export default function MyScrapPage() {
  const colleges = [
    {
      id: 97,
      name: "렌 경영대학",
      englishName: "ESC Rennes School of Business",
      region: "유럽권",
      country: "프랑스",
      homepageUrl: "https://www.rennes-sb.com/programmes/exchange-programme/",
      studentCapacity: 2,
      tuitionFeeType: "본교등록금납부형",
      gpaRequirement: null,
      semesterRequirement: "120ECTS 이상 이수해야 함\n(비고란 참조)",
      languageRequirements: { ibt: "72", itp: "543", toeic: "785", ielts: "5.5" },
      formatName: "esc_rennes_school_of_business",
    },
    {
      id: 98,
      name: "르아브르대학",
      englishName: "University of Le Havre",
      region: "유럽권",
      country: "프랑스",
      homepageUrl: "https://www.univ-lehavre.fr",
      studentCapacity: 3,
      tuitionFeeType: "본교등록금납부형",
      gpaRequirement: null,
      semesterRequirement: "2",
      languageRequirements: { ibt: "72", itp: "543", toeic: "785", ielts: "5.5" },
      formatName: "university_of_le_havre",
    },
    {
      id: 99,
      name: "릴 가톨릭 대학",
      englishName: "Lille Catholic University",
      region: "유럽권",
      country: "프랑스",
      homepageUrl: "http://www.univ-catholille.fr/",
      studentCapacity: 5,
      tuitionFeeType: "본교등록금납부형",
      gpaRequirement: "2.75",
      semesterRequirement: "2",
      languageRequirements: { ibt: "72", itp: "543", toeic: "785", ielts: "5.5" },
      formatName: "lille_catholic_university",
    },
  ];

  const titleStyle = {
    margin: "20px 0 10px 20px",
    fontFamily: "Abhaya Libre ExtraBold",
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: "800",
    lineHeight: "normal",
  };

  return (
    <>
      <TopDetailNavigation title="즐거찾기" />
      <div style={titleStyle}>위시학교</div>
      <CollegeCards colleges={colleges} />
    </>
  );
}
