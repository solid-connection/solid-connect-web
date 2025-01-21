import BlockBtn from "@/components/button/BlockBtn";

import { ListUniversity } from "@/types/university";

type UniversityStepProps = {
  universityList: ListUniversity[];
  curUniversityList: number[];
  setCurUniversityList: (idList: number[]) => void;
  onNext: () => void;
};

const UniversityStep = ({ universityList, curUniversityList, setCurUniversityList, onNext }: UniversityStepProps) => {
  const handleSelect = (index: number, value: number) => {
    const newList = [...curUniversityList];
    newList[index] = value;
    setCurUniversityList(newList);
  };
  return (
    <div>
      <div>해외 파견 학교를 검색하세요</div>
      <div>
        <label>1지망</label>
        <select value={curUniversityList[0] ?? ""} onChange={(e) => handleSelect(0, Number(e.target.value))}>
          <option value=""></option>
          {universityList.map((university) => (
            <option key={university.id} value={university.id}>
              [{university.region} - {university.country}]{university.koreanName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>2지망</label>
        <select value={curUniversityList[1] ?? ""} onChange={(e) => handleSelect(1, Number(e.target.value))}>
          <option value=""></option>
          {universityList.map((university) => (
            <option key={university.id} value={university.id}>
              [{university.region} - {university.country}]{university.koreanName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>3지망</label>
        <select value={curUniversityList[2] ?? ""} onChange={(e) => handleSelect(2, Number(e.target.value))}>
          <option value=""></option>
          {universityList.map((university) => (
            <option key={university.id} value={university.id}>
              [{university.region} - {university.country}]{university.koreanName}
            </option>
          ))}
        </select>
      </div>
      <div className="fixed bottom-14 w-full max-w-[600px] bg-white">
        <div className="mb-[37px] px-5">
          <BlockBtn
            onClick={() => {
              onNext();
            }}
          >
            다음
          </BlockBtn>
        </div>
      </div>
    </div>
  );
};

export default UniversityStep;
