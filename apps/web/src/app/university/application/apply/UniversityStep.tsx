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
          description="희망하는 학교를 1지망부터 3지망까지 선택해주세요."
        />
        <div className="mt-5 rounded-lg bg-white p-4 shadow-sdwB">
          <p className="text-k-500 typo-regular-2">본 과정 완료 후, 지원자 현황을 확인할 수 있습니다.</p>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="block text-k-800 typo-medium-2">1지망</label>
              <Select
                value={curUniversityList[0]?.toString() ?? null}
                onValueChange={(value: string) => handleSelect(0, parseInt(value, 10))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="학교를 선택해주세요" />
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
              <label className="block text-k-800 typo-medium-2">2지망</label>
              <Select
                value={curUniversityList[1]?.toString() ?? null}
                onValueChange={(value: string) => handleSelect(1, parseInt(value, 10))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="선택 안 함" />
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
              <label className="block text-k-800 typo-medium-2">3지망</label>
              <Select
                value={curUniversityList[2]?.toString() ?? null}
                onValueChange={(value: string) => handleSelect(2, parseInt(value, 10))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="선택 안 함" />
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
