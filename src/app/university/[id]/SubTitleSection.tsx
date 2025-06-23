interface SubTitleSectionProps {
  totalDispatchCount: number;
  country: string;
  studentCapacity: number;
}

const SubTitleSection = ({ totalDispatchCount, country, studentCapacity }: SubTitleSectionProps) => {
  return (
    <div className="mb-7 mt-10 flex justify-center divide-x">
      <span className="px-[30px] text-sm font-semibold leading-normal text-k-900">{totalDispatchCount}회 파견</span>
      <span className="px-[30px] text-sm font-semibold leading-normal text-k-900">{country}</span>
      <span className="px-[30px] text-sm font-semibold leading-normal text-k-900">모집 {studentCapacity}명</span>
    </div>
  );
};

export default SubTitleSection;
