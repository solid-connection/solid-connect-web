import { useEffect, useRef, useState } from "react";

import { Mentor } from "@/types/mentor";

import { getMentorList } from "@/api/mento";

const useGetMentorList = (selectedFilter) => {
  const [page, setPage] = useState<number>(0);
  const [mentorList, setMentorList] = useState<Mentor[]>([]);
  const [hasMoreContent, setHasMoreContent] = useState<boolean>(true);

  const infiniteScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMyData = async () => {
      await getMentorList().then((res) => {});
    };
  }, []);

  return {};
};
export default useGetMentorList;
