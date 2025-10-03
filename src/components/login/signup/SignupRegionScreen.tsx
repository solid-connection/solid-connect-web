"use client";

import { toast } from "@/lib/zustand/useToastStore";

import { Dispatch, SetStateAction } from "react";

import clsx from "clsx";

import BlockBtn from "@/components/button/BlockBtn";

import {
  IconSignupRegionAmerica,
  IconSignupRegionAsia,
  IconSignupRegionEurope,
  IconSignupRegionWorld,
} from "@/public/svgs";

const regionList = [
  {
    name: "미주권",
    icon: <IconSignupRegionAmerica />,
    countries: ["미국", "캐나다", "호주", "브라질"],
  },
  {
    name: "아시아권",
    icon: <IconSignupRegionAsia />,
    countries: [
      "말레이시아",
      "브루나이",
      "싱가포르",
      "아제르바이잔",
      "인도네시아",
      "일본",
      "키르기스스탄",
      "튀르키예",
      "홍콩",
      "중국",
      "대만",
      "카자흐스탄",
      "이스라엘",
    ],
  },
  {
    name: "유럽권",
    icon: <IconSignupRegionEurope />,
    countries: [
      "네덜란드",
      "노르웨이",
      "덴마크",
      "독일",
      "리투아니아",
      "리히텐슈타인",
      "스웨덴",
      "스위스",
      "스페인",
      "오스트리아",
      "체코",
      "포르투갈",
      "폴란드",
      "프랑스",
      "핀란드",
      "러시아",
    ],
  },
  {
    name: "아직 잘 모르겠어요",
    icon: <IconSignupRegionWorld />,
    countries: [],
  },
];

type SignupRegionScreenProps = {
  curRegion: string | null;
  setCurRegion: Dispatch<SetStateAction<string | null>>;
  curCountries: string[];
  setCurCountries: Dispatch<SetStateAction<string[]>>;
  toNextStage: () => void;
};

const SignupRegionScreen = ({
  curRegion,
  setCurRegion,
  curCountries,
  setCurCountries,
  toNextStage,
}: SignupRegionScreenProps) => {
  const submit = () => {
    if (!curRegion) {
      toast.error("권역을 선택해주세요.");
      return;
    }
    toNextStage();
  };

  return (
    <div className="mb-40">
      <div className="px-5">
        <div className="mt-5">
          <span className="text-2xl font-bold leading-snug text-k-900">
            현재 나의
            <span className="text-primary"> 관심 국가</span>를
            <br />
            선택해주세요.
          </span>
        </div>

        <div className="mt-10">
          <RegionButtons curRegion={curRegion} setCurRegion={setCurRegion} />
          <CountryButtons curCountries={curCountries} setCurCountries={setCurCountries} region={curRegion} />
        </div>
      </div>
      <div className="fixed bottom-14 w-full max-w-[600px] bg-white">
        <div className="px-5">
          <BlockBtn className="mb-[29px]" disabled={!curRegion} onClick={submit}>
            다음
          </BlockBtn>
        </div>
      </div>
    </div>
  );
};

export default SignupRegionScreen;

type RegionButtonsProps = {
  curRegion: string | null;
  setCurRegion: Dispatch<SetStateAction<string | null>>;
};

const RegionButtons = ({ curRegion, setCurRegion }: RegionButtonsProps) => (
  <div className="grid grid-cols-2 gap-5">
    {regionList.map((region) => (
      <button
        key={region.name}
        className={clsx("relative flex h-[82px] flex-col items-center justify-center rounded-lg", {
          "border-none bg-k-50": curRegion !== region.name,
          "border-2 border-primary-500 bg-primary-100": curRegion === region.name,
        })}
        onClick={() => setCurRegion(region.name)}
      >
        <div>{region.icon}</div>
        <span className="text-base font-semibold text-k-800">{region.name}</span>
        {curRegion === "아직 잘 모르겠어요" && region.name === "아직 잘 모르겠어요" && (
          <div className="absolute top-[100px] flex justify-center">
            <div className="absolute bottom-full left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-b-[12px] border-x-transparent border-b-primary"></div>
            <div className="relative rounded-lg bg-primary px-4 py-3">
              <p className="text-center text-sm font-normal leading-normal text-white">
                괜찮아요,
                <br />
                솔커에서 다양한 정보를
                <br />
                탐색해보세요!
              </p>
            </div>
          </div>
        )}
      </button>
    ))}
  </div>
);

type CountryButtonsProps = {
  curCountries: string[];
  setCurCountries: Dispatch<SetStateAction<string[]>>;
  region: string | null;
};

const CountryButtons = ({ curCountries, setCurCountries, region }: CountryButtonsProps) => {
  const toggleCountry = (country: string) => {
    if (curCountries.includes(country)) {
      setCurCountries(curCountries.filter((c) => c !== country));
    } else {
      setCurCountries([...curCountries, country]);
    }
  };

  const countries = regionList.find((r) => r.name === region)?.countries || [];

  return (
    <div className="mt-5 grid grid-cols-3 gap-4">
      {countries.map((country) => (
        <button
          key={country}
          className={clsx("h-8 rounded-sm border-none", {
            "bg-k-50 hover:bg-k-100": !curCountries.includes(country),
            "bg-primary-100": curCountries.includes(country),
          })}
          onClick={() => toggleCountry(country)}
          type="button"
        >
          {country}
        </button>
      ))}
    </div>
  );
};
