"use client";

import { useState } from "react";

import TextModal from "@/components/modal/TextModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

import type { ListUniversity } from "@/types/university";
import ApplicationBottomActionBar from "../_components/ApplicationBottomActionBar";
import ApplicationSectionTitle from "../_components/ApplicationSectionTitle";

type UniversityStepProps = {
  universityList: ListUniversity[];
  curUniversityList: number[];
  setCurUniversityList: (idList: number[]) => void;
  maxChoiceCount: number;
  onNext: () => void;
};

const UniversityStep = ({
  universityList,
  curUniversityList,
  setCurUniversityList,
  maxChoiceCount,
  onNext,
}: UniversityStepProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const choiceIndexes = Array.from({ length: maxChoiceCount }, (_, index) => index);

  const handleSelect = (index: number, value: number) => {
    const newList = curUniversityList.slice(0, maxChoiceCount);
    newList[index] = value;
    setCurUniversityList(newList);
  };

  const isDisabled = (universityId: number, currentIndex: number) =>
    curUniversityList.some((pickedId, i) => i !== currentIndex && pickedId > 0 && pickedId === universityId);

  const handleNext = () => {
    if (curUniversityList.length === 0 || curUniversityList[0] === 0) {
      setIsModalOpen(true);
      return;
    }
    onNext();
  };

  return (
    <>
      <div className="my-5 px-5">
        <ApplicationSectionTitle
          title="지원 학교 선택"
          description={`희망하는 학교를 1지망부터 ${maxChoiceCount}지망까지 선택해주세요.`}
        />
        <div className="mt-5 rounded-lg bg-white p-4 shadow-sdwB">
          <p className="text-k-500 typo-regular-2">본 과정 완료 후, 지원자 현황을 확인할 수 있습니다.</p>
          <div className="mt-4 flex flex-col gap-4">
            {choiceIndexes.map((index) => (
              <div key={index} className="flex flex-col gap-1">
                <label className="block text-k-800 typo-medium-2">{index + 1}지망</label>
                <Select
                  value={curUniversityList[index]?.toString() ?? null}
                  onValueChange={(value: string) => handleSelect(index, parseInt(value, 10))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={index === 0 ? "학교를 선택해주세요" : "선택 안 함"} />
                  </SelectTrigger>
                  <SelectContent>
                    {index > 0 && <SelectItem value="0">선택 안 함</SelectItem>}
                    {universityList.map((university) => (
                      <SelectItem
                        key={university.id}
                        value={university.id.toString()}
                        disabled={isDisabled(university.id, index)}
                      >
                        [{university.region} - {university.country}]{university.koreanName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ApplicationBottomActionBar label="다음" onClick={handleNext} />
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
