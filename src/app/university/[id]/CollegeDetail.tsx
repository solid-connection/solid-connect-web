import Image from "next/image";

interface CollegeDetailProps {
  imageUrl: string;
}

const CollegeDetail = ({ imageUrl }: CollegeDetailProps) => (
  <div className="fixed top-14 -z-20 h-[100vw] w-full">
    <div className="mac-w-[600px] absolute -z-10 h-[67vw] max-h-[400px] w-full">
      <Image
        className="h-full w-full object-cover"
        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${imageUrl}`}
        width={600}
        height={300}
        alt="학교 이미지"
      />
    </div>
  </div>
);

export default CollegeDetail;
