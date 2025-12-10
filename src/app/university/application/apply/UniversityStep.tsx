"use client";

import { useState } from "react";

import BlockBtn from "@/components/button/BlockBtn";
import TextModal from "@/components/modal/TextModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

import { ListUniversity } from "@/types/university";

type UniversityStepProps = {
  universityList: ListUniversity[];
  curUniversityList: number[];
  setCurUniversityList: (idList: number[]) => void;
  onNext: () => void;
};

const UniversityStep = ({ universityList, curUniversityList, setCurUniversityList, onNext }: UniversityStepProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <span className="font-serif typo-regular-4 text-[#acacac]">
            본 과정 완료 후, 지원자 현황을 확인 할 수 있습니다.
          </span>
        </div>
        <div className="mt-5">해외 파견 학교를 검색하세요.</div>
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="block font-serif typo-sb-9 text-k-900">1지망</label>
            <Select
              value={curUniversityList[0]?.toString() ?? null}
              onValueChange={(value: string) => handleSelect(0, parseInt(value, 10))}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {universityList.map((university) => (
                  <SelectItem
                    key={university.id}
                    value={university.id.toString()}
                    disabled={isDisabled(university.id, 0)}
                  >
                    [{university.region} - {university.country}]{university.koreanName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="block font-serif typo-sb-9 text-k-900">2지망</label>
            <Select
              value={curUniversityList[1]?.toString() ?? null}
              onValueChange={(value: string) => handleSelect(1, parseInt(value, 10))}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {universityList.map((university) => (
                  <SelectItem
                    key={university.id}
                    value={university.id.toString()}
                    disabled={isDisabled(university.id, 1)}
                  >
                    [{university.region} - {university.country}]{university.koreanName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="block font-serif typo-sb-9 text-k-900">3지망</label>
            <Select
              value={curUniversityList[2]?.toString() ?? null}
              onValueChange={(value: string) => handleSelect(2, parseInt(value, 10))}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {universityList.map((university) => (
                  <SelectItem
                    key={university.id}
                    value={university.id.toString()}
                    disabled={isDisabled(university.id, 2)}
                  >
                    [{university.region} - {university.country}]{university.koreanName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="max-w-app fixed bottom-14 w-full bg-white">
        <div className="mb-[37px] px-5">
          <BlockBtn
            onClick={() => {
              if (curUniversityList.length === 0 || curUniversityList[0] === 0) {
                setIsModalOpen(true);
                setCurUniversityList(curUniversityList.filter((id) => id !== null));
                return;
              }
              onNext();
            }}
          >
            다음
          </BlockBtn>
        </div>
      </div>
      <TextModal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        title=""
        content="적어도 1지망 대학은 선택해야합니다."
      />
    </>
  );
};

export default UniversityStep;
