import Image from "next/image";

import UniversityDetail from "../../components/university/university-detail";

export default function UniversityDetailPage(props) {
  return (
    <div>
      <Image src="" width={600} height={600} />
      <h1>{props.name}</h1>
      <UniversityDetail {...props} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { uuid } = params;

  return {
    props: { uuid: 1, name: "보라스 대학교", country: "스웨덴", region: "예톄보리", requirements: "토익 775 토플 90" },
  };
}
