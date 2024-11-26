"use client";

import { Dispatch, SetStateAction } from "react";

import BlockToggleBtn from "@/components/button/BlockToggleBtn";

import styles from "./signup.module.css";

import {
  IconSignupRegionAmerica,
  IconSignupRegionAsia,
  IconSignupRegionEurope,
  IconSignupRegionWorld,
} from "@/public/svgs";

const regionList = [
  {
    name: "미주권",
    countries: ["미국", "캐나다", "호주", "브라질"],
  },
  {
    name: "아시아권",
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
      alert("권역을 선택해주세요.");
      return;
    }
    toNextStage();
  };

  return (
    <div className={styles.screen}>
      <div className={styles["secondary-title"]}>교환학생에 대한 정보를 알려주세요.</div>
      <div className={styles.title}>
        어느 지역에
        <br />
        관심이 있으신가요?
      </div>

      <div className={styles["region-screen"]}>
        <RegionButtons curRegion={curRegion} setCurRegion={setCurRegion} />
        <CountryButtons curCountries={curCountries} setCurCountries={setCurCountries} region={curRegion} />
      </div>

      <div style={{ margin: "39px 10px 0 10px" }}>
        <BlockToggleBtn onClick={submit} isToggled={!!curRegion}>
          다음으로
        </BlockToggleBtn>
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
  <div className={styles["region-choices"]}>
    {regionList.map((region) => (
      <button
        key={region.name}
        className={`${styles["region-button"]} ${curRegion === region.name && styles["region-button--selected"]}`}
        onClick={() => setCurRegion(region.name)}
        type="button"
      >
        <div className={styles["region-button__icon"]}>
          {region.name === "미주권" && <IconSignupRegionAmerica />}
          {region.name === "유럽권" && <IconSignupRegionEurope />}
          {region.name === "아시아권" && <IconSignupRegionAsia />}
          {region.name === "아직 잘 모르겠어요" && <IconSignupRegionWorld />}
        </div>
        <div className={styles["region-button__name"]}>{region.name}</div>
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

  if (region === null || region === "아직 잘 모르겠어요") {
    return region === "아직 잘 모르겠어요" ? (
      <div className={styles.idk}>
        솔리드 커넥션에서 다양한 정보를 맛보고
        <br />
        가고 싶은 나라를 골라봐요
      </div>
    ) : null;
  }

  const countries = regionList.find((r) => r.name === region)?.countries || [];

  return (
    <div className={styles["country-choices"]}>
      {countries.map((country) => (
        <button
          key={country}
          className={`${styles["country-button"]} ${
            curCountries.includes(country) && styles["country-button--selected"]
          }`}
          onClick={() => toggleCountry(country)}
          type="button"
        >
          {country}
        </button>
      ))}
    </div>
  );
};
