import Image from "next/image";

import CollegeDetail from "../../components/college/detail/college-detail";

function CollegeDetailPage(props) {
  return <CollegeDetail {...props} />;
}

export default CollegeDetailPage;

export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;

  return {
    props: { id: 1, name: "보라스 대학교", country: "스웨덴", region: "예톄보리", requirements: "토익 775 토플 90" },
  };
}

export const runtime = "experimental-edge";
