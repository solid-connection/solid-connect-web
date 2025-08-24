import { useMemo, useState } from "react";

import { filterType } from "..";

import { ListUniversity, University } from "@/types/university";

import useGetMyWishUniversity from "@/api/university/client/useGetMyWishUniversity";

interface UseSortedUniversitiesReturn {
  wishUniversity: ListUniversity[];
  sortedUniversities: ListUniversity[];
  handleSelect: (value: string) => void;
}

const useSortedUniversities = (): UseSortedUniversitiesReturn => {
  const { data: wishUniversity = [] } = useGetMyWishUniversity();

  const [sequence, setSequence] = useState<filterType>(filterType.LATEST);

  // 드롭다운에서 항목을 선택했을 때 호출될 함수
  const handleSelect = (value: string) => {
    setSequence(value as filterType);
  };

  // 'sequence'나 'wishUniversity'가 변경될 때만 정렬 로직을 다시 실행
  const sortedUniversities = useMemo(() => {
    // 원본 배열의 수정을 방지하기 위해 새로운 배열로 복사
    const newWishUniversity = [...wishUniversity];

    switch (sequence) {
      // '모집인원 순'일 경우 studentCapacity를 기준으로 내림차순 정렬
      case filterType.NUMBER_OF_RECRUIT:
        return newWishUniversity.sort((a: University, b: University) => b.studentCapacity - a.studentCapacity);

      // TODO 성적순 정렬 기능 구현
      // '낮은 성적순'은 데이터에 없으므로 기본값(최신순)으로 처리
      case filterType.LOW_SCORE:
      // '편집하기'는 정렬 기능이 아니므로 기본값(최신순)으로 처리
      case filterType.EDIT:
      // '최신순'이 기본값이므로 그대로 반환
      case filterType.LATEST:
      default:
        return wishUniversity; // 원본 순서(최신순) 그대로 반환
    }
  }, [wishUniversity, sequence]); // 의존성 배열

  return { wishUniversity, sortedUniversities, handleSelect };
};
export default useSortedUniversities;
