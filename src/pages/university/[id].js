import Image from "next/image";

import UniversityBottomSheet from "../../components/college/detail/college-bottomsheet";

export default function UniversityDetailPage(props) {
  return (
    <div>
      <Image src="" width={600} height={600} />
      <h1>{props.name}</h1>
      <UniversityBottomSheet {...props} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;

  return {
    props: { id: 1, name: "보라스 대학교", country: "스웨덴", region: "예톄보리", requirements: "토익 775 토플 90" },
  };
}

export const runtime = "experimental-edge";
