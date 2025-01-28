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

  const isDisabled = (universityId: number, currentIndex: number) =>
    curUniversityList.some((pickedId, i) => i !== currentIndex && pickedId === universityId);

  return (
    <>
      <div className="px-5">
        <div>
          <span className="font-serif text-xs font-normal leading-normal text-[#acacac]">
            본 과정 완료 후, 지원자 현황을 확인 할 수 있습니다.
          </span>
        </div>
        <div className="mt-5">해외 파견 학교를 검색하세요.</div>
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="block font-serif text-sm font-semibold leading-normal text-k-900">1지망</label>
            <select
              className="flex h-10 items-center rounded-lg bg-k-50 px-5 py-2.5 font-serif text-sm font-semibold leading-normal text-primary"
              value={curUniversityList[0] ?? ""}
              onChange={(e) => handleSelect(0, Number(e.target.value))}
            >
              <option value=""></option>
              {universityList.map((university) => (
                <option key={university.id} value={university.id} disabled={isDisabled(university.id, 0)}>
                  [{university.region} - {university.country}]{university.koreanName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="block font-serif text-sm font-semibold leading-normal text-k-900">2지망</label>
            <select
              className="flex h-10 items-center rounded-lg bg-k-50 px-5 py-2.5 font-serif text-sm font-semibold leading-normal text-primary"
              value={curUniversityList[1] ?? ""}
              onChange={(e) => handleSelect(1, Number(e.target.value))}
            >
              <option value=""></option>
              {universityList.map((university) => (
                <option key={university.id} value={university.id} disabled={isDisabled(university.id, 1)}>
                  [{university.region} - {university.country}]{university.koreanName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="block font-serif text-sm font-semibold leading-normal text-k-900">3지망</label>
            <select
              className="flex h-10 items-center rounded-lg bg-k-50 px-5 py-2.5 font-serif text-sm font-semibold leading-normal text-primary"
              value={curUniversityList[2] ?? ""}
              onChange={(e) => handleSelect(2, Number(e.target.value))}
            >
              <option value=""></option>
              {universityList.map((university) => (
                <option key={university.id} value={university.id} disabled={isDisabled(university.id, 2)}>
                  [{university.region} - {university.country}]{university.koreanName}
                </option>
              ))}
            </select>
          </div>
        </div>
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
    </>
  );
};

export default UniversityStep;
