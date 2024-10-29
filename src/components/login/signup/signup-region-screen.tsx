import { Dispatch, SetStateAction } from "react";

import BlockToggleBtn from "@/components/button/block-toggle-btn";

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

export default function SignupRegionScreen({
  curRegion,
  setCurRegion,
  curCountries,
  setCurCountries,
  toNextStage,
}: SignupRegionScreenProps) {
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
        <ConuntryButtons curCountries={curCountries} setCurCountries={setCurCountries} region={curRegion} />
      </div>

      <div style={{ margin: "39px 10px 0 10px" }}>
        <BlockToggleBtn onClick={submit} isToggled={!!curRegion}>
          다음으로
        </BlockToggleBtn>
      </div>
    </div>
  );
}

type RegionButtonsProps = {
  curRegion: string | null;
  setCurRegion: Dispatch<SetStateAction<string | null>>;
};

function RegionButtons({ curRegion, setCurRegion }: RegionButtonsProps) {
  return (
    <div className={styles["region-choices"]}>
      <button
        className={`${styles["region-button"]} ${curRegion === "미주권" && styles["region-button--selected"]}`}
        onClick={() => setCurRegion("미주권")}
        type="button"
      >
        <div className={styles["region-button__icon"]}>
          <IconSignupRegionAmerica />
        </div>
        <div className={styles["region-button__name"]}>미주권</div>
      </button>

      <button
        className={`${styles["region-button"]} ${curRegion === "유럽권" && styles["region-button--selected"]}`}
        onClick={() => setCurRegion("유럽권")}
        type="button"
      >
        <div className={styles["region-button__icon"]}>
          <IconSignupRegionEurope />
        </div>
        <div className={styles["region-button__name"]}>유럽권</div>
      </button>

      <button
        className={`${styles["region-button"]} ${styles[curRegion === "아시아권" && "region-button--selected"]}`}
        onClick={() => setCurRegion("아시아권")}
        type="button"
      >
        <div className={styles["region-button__icon"]}>
          <IconSignupRegionAsia />
        </div>
        <div className={styles["region-button__name"]}>아시아권</div>
      </button>

      <button
        className={`${styles["region-button"]} ${styles[curRegion === "아직 잘 모르겠어요" && "region-button--selected"]}`}
        onClick={() => setCurRegion("아직 잘 모르겠어요")}
        type="button"
      >
        <div className={styles["region-button__icon"]}>
          <IconSignupRegionWorld />
        </div>
        <div className={styles["region-button__name"]}>아직 잘 모르겠어요</div>
      </button>
    </div>
  );
}

type ConuntryButtonsProps = {
  curCountries: string[];
  setCurCountries: Dispatch<SetStateAction<string[]>>;
  region: string | null;
};

function ConuntryButtons({ curCountries, setCurCountries, region }: ConuntryButtonsProps) {
  const addCountry = (country: string) => {
    if (curCountries.includes(country)) {
      setCurCountries(curCountries.filter((c) => c !== country));
    } else {
      setCurCountries([...curCountries, country]);
    }
  };

  const removeCountry = (country: string) => {
    setCurCountries(curCountries.filter((c) => c !== country));
  };

  const isCountrySelected = (country: string) => curCountries.includes(country);

  if (region === null) {
    return null;
  }

  if (region === "아직 잘 모르겠어요") {
    return (
      <div className={styles.idk}>
        솔리드 커넥션에서 다양한 정보를 맛보고
        <br />
        가고 싶은 나라를 골라봐요
      </div>
    );
  }

  return (
    <div className={styles["country-choices"]}>
      {regionList
        .find((r) => r.name === region)
        ?.countries.map((country) => (
          <button
            key={country}
            className={`${styles["country-button"]} ${isCountrySelected(country) && styles["country-button--selected"]}`}
            onClick={() => {
              if (isCountrySelected(country)) {
                removeCountry(country);
              } else {
                addCountry(country);
              }
            }}
            type="button"
          >
            {country}
          </button>
        ))}
    </div>
  );
}
