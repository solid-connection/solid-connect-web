"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";

import TextModal from "@/components/modal/TextModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

import type { ListUniversity } from "@/types/university";
import ApplicationBottomActionBar from "../_components/ApplicationBottomActionBar";

type UniversityStepProps = {
  universityList: ListUniversity[];
  curUniversityList: number[];
  setCurUniversityList: (idList: number[]) => void;
  maxChoiceCount: number;
  onNext: () => void;
  variant?: "mobile" | "desktop";
};

type UniversityChoiceSelectProps = {
  index: number;
  universityList: ListUniversity[];
  selectedUniversityId?: number;
  isSelectable: boolean;
  onSelect: (index: number, universityId: number) => void;
  isDisabled: (universityId: number, currentIndex: number) => boolean;
};

const UniversityChoiceSelect = ({
  index,
  universityList,
  selectedUniversityId,
  isSelectable,
  onSelect,
  isDisabled,
}: UniversityChoiceSelectProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="block text-k-600 typo-sb-9">{index + 1}지망</label>
      <Select
        value={selectedUniversityId?.toString()}
        disabled={!isSelectable}
        onValueChange={(value) => onSelect(index, Number(value))}
      >
        <SelectTrigger className="h-[45px] border-0 bg-k-50 px-5 py-3 text-center text-primary shadow-none typo-sb-9 focus:ring-0 focus:ring-offset-0 data-[state=open]:border data-[state=open]:border-primary data-[state=open]:bg-white [&>span]:w-full">
          <SelectValue placeholder={index === 0 ? "학교를 선택해주세요" : "선택 안 함"} />
        </SelectTrigger>
        <SelectContent className="rounded-lg border-[#aba7fa] bg-white p-0 shadow-none">
          {index > 0 && <SelectItem value="0">선택 안 함</SelectItem>}
          {universityList.map((university) => (
            <SelectItem
              key={university.id}
              value={university.id.toString()}
              disabled={isDisabled(university.id, index)}
              className="h-10 bg-white px-5 py-0 text-k-800 typo-medium-2 focus:bg-[#efeeff] focus:text-primary data-[state=checked]:bg-[#efeeff] data-[state=checked]:text-primary data-[disabled]:text-primary"
            >
              [{university.country}] {university.koreanName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const UniversityStep = ({
  universityList,
  curUniversityList,
  setCurUniversityList,
  maxChoiceCount,
  onNext,
  variant = "mobile",
}: UniversityStepProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const choiceIndexes = useMemo(() => Array.from({ length: maxChoiceCount }, (_, index) => index), [maxChoiceCount]);
  const isDesktop = variant === "desktop";

  const handleSelect = (index: number, value: number) => {
    const newList = curUniversityList.slice(0, maxChoiceCount);
    newList[index] = value;
    if (value === 0) {
      newList.length = index + 1;
    }
    setCurUniversityList(newList);
  };

  const isDisabled = (universityId: number, currentIndex: number) =>
    curUniversityList.some((pickedId, i) => i !== currentIndex && pickedId > 0 && pickedId === universityId);

  const isSelectable = (index: number) => index === 0 || Number(curUniversityList[index - 1]) > 0;

  const handleNext = () => {
    if (curUniversityList.length === 0 || curUniversityList[0] === 0) {
      setIsModalOpen(true);
      return;
    }
    onNext();
  };

  return (
    <>
      <div className={clsx(isDesktop ? "" : "px-5 pb-40 pt-3")}>
        <p className="text-k-300 typo-regular-4">본 과정 완료 후, 지원자 현황을 확인할 수 있습니다.</p>
        <div className={clsx(isDesktop ? "mt-6 grid gap-4 md:grid-cols-2" : "mt-7 flex flex-col gap-[7px]")}>
          {choiceIndexes.map((index) => (
            <UniversityChoiceSelect
              key={index}
              index={index}
              universityList={universityList}
              selectedUniversityId={curUniversityList[index]}
              isSelectable={isSelectable(index)}
              onSelect={handleSelect}
              isDisabled={isDisabled}
            />
          ))}
        </div>
      </div>
      <ApplicationBottomActionBar label="다음" onClick={handleNext} variant={variant} />
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
