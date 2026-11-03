"use client";

import clsx from "clsx";
import type { Dispatch, SetStateAction } from "react";
import BlockBtn from "@/components/button/BlockBtn";
import { regionList } from "@/constants/regions";
import { showIconToast } from "@/lib/toast/showIconToast";

type SignupRegionScreenProps = {
  curRegion: string | null;
  setCurRegion: Dispatch<SetStateAction<string | null>>;
  curCountries: string[];
  setCurCountries: Dispatch<SetStateAction<string[]>>;
  toNextStage: () => void;
};

const SignupRegionScreenBase = ({
  curRegion,
  setCurRegion,
  curCountries,
  setCurCountries,
  toNextStage,
  isDesktop,
}: SignupRegionScreenProps & { isDesktop: boolean }) => {
  const submit = () => {
    if (!curRegion) {
      showIconToast("logo", "권역을 선택해주세요.");
      return;
    }
    toNextStage();
  };

  return (
    <div>
      <div className={isDesktop ? "" : "px-5"}>
        <div className={isDesktop ? "" : "mt-5"}>
          <span className="text-k-900 typo-bold-1">
            현재 나의
            <span className="text-primary"> 관심 국가</span>를
            <br />
            선택해주세요.
          </span>
        </div>

        <div className="mt-10">
          <RegionButtons curRegion={curRegion} setCurRegion={setCurRegion} isDesktop={isDesktop} />
          <CountryButtons
            curCountries={curCountries}
            setCurCountries={setCurCountries}
            region={curRegion}
            isDesktop={isDesktop}
          />
        </div>
      </div>

      <div className={isDesktop ? "mt-8" : "mt-10 px-5 pb-7"}>
        <BlockBtn disabled={!curRegion} onClick={submit}>
          다음
        </BlockBtn>
      </div>
    </div>
  );
};

export const DesktopSignupRegionScreen = (props: SignupRegionScreenProps) => (
  <SignupRegionScreenBase {...props} isDesktop />
);

export const MobileSignupRegionScreen = (props: SignupRegionScreenProps) => (
  <SignupRegionScreenBase {...props} isDesktop={false} />
);

export default MobileSignupRegionScreen;

type RegionButtonsProps = {
  curRegion: string | null;
  setCurRegion: Dispatch<SetStateAction<string | null>>;
  isDesktop: boolean;
};

const RegionButtons = ({ curRegion, setCurRegion, isDesktop }: RegionButtonsProps) => (
  <div className={isDesktop ? "grid grid-cols-3 gap-4" : "grid grid-cols-2 gap-5"}>
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
        <span className="text-k-800 typo-sb-7">{region.name}</span>
        {curRegion === "아직 잘 모르겠어요" && region.name === "아직 잘 모르겠어요" && (
          <div className="absolute top-[100px] flex justify-center">
            <div className="absolute bottom-full left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-b-[12px] border-x-transparent border-b-primary"></div>
            <div className="relative rounded-lg bg-primary px-4 py-3">
              <p className="text-center text-white typo-regular-2">
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
  isDesktop: boolean;
};

const CountryButtons = ({ curCountries, setCurCountries, region, isDesktop }: CountryButtonsProps) => {
  const toggleCountry = (country: string) => {
    if (curCountries.includes(country)) {
      setCurCountries(curCountries.filter((c) => c !== country));
    } else {
      setCurCountries([...curCountries, country]);
    }
  };

  const countries = regionList.find((r) => r.name === region)?.countries || [];

  return (
    <div className={isDesktop ? "mt-5 grid grid-cols-4 gap-3" : "mt-5 grid grid-cols-3 gap-4"}>
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
