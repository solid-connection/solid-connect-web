"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { shortenLanguageTestName } from "@/utils/universityUtils";

import ButtonTab from "@/components/ui/ButtonTab";
import CheveronRightFilled from "@/components/ui/icon/ChevronRightFilled";

import UniversityCards from "../college/UniversityCards";

import { ListUniversity, regionMapping } from "@/types/university";

import { getUniversityListPublicApi } from "@/api/university";

const UniversityList = () => {
  const [region, setRegion] = useState<"전체" | "영미권" | "유럽권" | "아시아권">("전체");
  const [universities, setUniversities] = useState<ListUniversity[]>([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await getUniversityListPublicApi(regionMapping[region]);
        setUniversities(response.data.slice(0, 3));
      } catch {
        setUniversities([]);
      }
    };

    fetchUniversities();
  }, [region]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <span className="text-lg font-semibold leading-snug text-[#44413D]">전체 학교 리스트</span>
        <Link href="/university">
          <span className="text-[13px] font-semibold leading-snug text-[#76797D] underline decoration-solid decoration-auto underline-offset-auto">
            더보기
          </span>
        </Link>
      </div>
      <div className="">
        <ButtonTab // TODO: 디자인 변경
          choices={["전체", "영미권", "유럽권", "아시아권", "중국권"]}
          choice={region}
          setChoice={setRegion}
          color={{
            activeBtn: "bg-secondary-100",
            deactiveBtn: "bg-k-50",
            activeBtnFont: "text-secondary",
            deactiveBtnFont: "text-k-300",
            background: "white",
          }}
        />
      </div>
      <UniversityCards colleges={universities} showCapacity={false} />
    </div>
  );
};

export default UniversityList;
