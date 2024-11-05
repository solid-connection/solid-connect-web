"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import UniversityCards from "@/components/college/UniversityCards";
import TopNavigation from "@/components/layout/top-navigation";
import ButtonTab from "@/components/ui/button-tab";

import UniversitySearch from "./UniversitySearch";

import { REGIONS_KO } from "@/constants/university";
import { ListUniversity, RegionKo } from "@/types/university";

const REGIONS = ["전체", ...REGIONS_KO];

const UniversityPage = ({ universities }: { universities: ListUniversity[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const queryRegion = searchParams?.get("region") || "전체";
  const queryKeyword = searchParams?.get("keyword") || "";
  const querySearchTexts = queryKeyword ? queryKeyword.split(",") : [""];

  const [searchTexts, setSearchTexts] = useState<string[]>(querySearchTexts[0] !== undefined ? querySearchTexts : [""]);
  const searchTextRef = useRef<HTMLInputElement | null>(null);

  const [region, setRegion] = useState<RegionKo | "전체" | string>(queryRegion || "전체");

  const [filteredColleges, setFilteredColleges] = useState<ListUniversity[]>(universities);

  // 필터링
  useEffect(() => {
    const filtered = universities.filter((college) => {
      // 지역 필터
      const matchesRegion = region === "전체" || region === null ? true : college.region === region;
      // 검색 필터
      let matchesSearchText = true;
      if (searchTexts && searchTexts.length) {
        matchesSearchText = searchTexts.some(
          (searchTerm) =>
            college.koreanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            college.country.includes(searchTerm.toLowerCase()),
        );
      }
      // 성적 필터
      return matchesRegion && matchesSearchText;
    });
    setFilteredColleges(filtered);
  }, [region, searchTexts]);

  // 쿼리스트링 업데이트
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams?.toString());
    if (region && region !== "전체") {
      params.set("region", region);
    } else {
      params.delete("region");
    }
    if (searchTexts.filter((text) => text).length > 0) {
      params.set("keyword", searchTexts.filter((text) => text).join(","));
    } else {
      params.delete("keyword");
    }
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
  }, [region, searchTexts]);

  function searchHandler(event) {
    event.preventDefault();
    const searchTerms: string[] = searchTextRef.current.value
      .split(",")
      .map((term) => term.trim())
      .filter((term) => term !== "");
    setSearchTexts(searchTerms);
  }

  return (
    <>
      <TopNavigation />
      <UniversitySearch
        searchHandler={(e) => {
          searchHandler(e);
        }}
        textRef={searchTextRef}
        defaultValue={searchTexts.join(",")}
      />
      <ButtonTab
        choices={REGIONS}
        choice={region}
        setChoice={setRegion}
        color={{ deactiveBtn: "#F0F0F0", deactiveBtnFont: "#A2A2A2" }}
        style={{ marginTop: "14px", marginLeft: "18px" }}
      />
      <UniversityCards colleges={filteredColleges} style={{ marginTop: "12px" }} />
    </>
  );
};

export default UniversityPage;
