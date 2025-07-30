import { useEffect, useState } from "react";

import useFetch from "@/utils/apiUtils";

import { MentorCardDetail } from "../type/response";

interface UseGetMentorListProps {
  region?: string;
  page?: number;
}

interface UseGetMentorListReturn {
  mentorList: MentorCardDetail[];
  loading: boolean;
  error: unknown;
}

interface MentorListResponse {
  /** 다음 페이지 번호. 다음 페이지가 없으면 -1 */
  nextPageNumber: number;
  content: MentorCardDetail[];
}

const OFFSET = 10; // 기본 페이지 크기

const useGetMentorList = ({ region = "전체", page = 0 }: UseGetMentorListProps = {}): UseGetMentorListReturn => {
  const { result, loading, error, fetchData } = useFetch<MentorListResponse>();
  const [mentorList, setMentorList] = useState<MentorCardDetail[]>([]);
  const [nextPageNumber, setNextPageNumber] = useState<number>(0);

  useEffect(() => {
    // nextPageNumber가 -1이면 더 이상 호출하지 않음
    if (nextPageNumber === -1) return;

    fetchData({
      method: "GET",
      url: `/mentor?region=${region}&page=${page}&size=${OFFSET}`,
      body: undefined,
      isToken: true,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, page, nextPageNumber, fetchData]);

  useEffect(() => {
    if (result) {
      // 추가 로딩된 콘텐츠를 기존 배열에 병합
      setMentorList((prev) => [...prev, ...result.data.content]);
      setNextPageNumber(result.data.nextPageNumber);
    }
  }, [result]);

  return {
    mentorList,
    loading,
    error,
  };
};

export default useGetMentorList;
