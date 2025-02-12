"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { signUpApi } from "@/services/auth";
import { uploadProfileImageFilePublicApi } from "@/services/file";
import { saveAccessToken, saveRefreshToken } from "@/utils/localStorage";

import SignupPrepareScreen from "./SignupPrepareScreen";
import SignupProfileScreen from "./SignupProfileScreen";
import SignupRegionScreen from "./SignupRegionScreen";

import { Gender, PreparationStatus, RegisterRequest } from "@/types/auth";
import { RegionKo } from "@/types/university";

type SignupSurveyProps = {
  signUpToken: string;
  baseNickname: string;
  baseEmail: string;
  baseProfileImageUrl: string;
};

const SignupSurvey = ({ signUpToken, baseNickname, baseEmail, baseProfileImageUrl }: SignupSurveyProps) => {
  const router = useRouter();
  const [curStage, setCurStage] = useState<number>(1);

  const [curPreparation, setCurPreparation] = useState<PreparationStatus | null>(null);

  const [region, setRegion] = useState<RegionKo | "아직 잘 모르겠어요" | null>(null);
  const [countries, setCountries] = useState<string[]>([]);

  const [nickname, setNickname] = useState<string>(baseNickname);
  const [gender, setGender] = useState<Gender | "">("");
  const [birth, setBirth] = useState<string>("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const convertBirth = (value: string): string => {
    if (value.length !== 8) {
      throw new Error("생년월일을 8자리로 입력해주세요.");
    }

    const year = value.substring(0, 4);
    const month = value.substring(4, 6);
    const day = value.substring(6, 8);

    const formattedDate = `${year}-${month}-${day}`;

    const date = new Date(formattedDate);
    const isValidDate =
      date.getFullYear() === parseInt(year, 10) &&
      date.getMonth() + 1 === parseInt(month, 10) &&
      date.getDate() === parseInt(day, 10);

    if (!isValidDate) {
      throw new Error("유효한 날짜가 아닙니다.");
    }

    return formattedDate;
  };

  const createRegisterRequest = async (): Promise<RegisterRequest> => {
    const submitRegion: RegionKo[] = region === "아직 잘 모르겠어요" ? [] : [region as RegionKo];

    if (!curPreparation) {
      throw new Error("준비 단계를 선택해주세요");
    }

    if (gender === "") {
      throw new Error("성별을 선택해주세요");
    }

    const convertedBirth: string = convertBirth(birth);

    let imageUrl: string | null = baseProfileImageUrl;

    if (profileImageFile) {
      try {
        const res = await uploadProfileImageFilePublicApi(profileImageFile);
        imageUrl = res.data.fileUrl;
      } catch (err) {
        console.error("Error", err.message);
        alert(err.message);
      }
    }

    return {
      signUpToken: signUpToken,
      interestedRegions: submitRegion,
      interestedCountries: countries,
      preparationStatus: curPreparation,
      nickname,
      profileImageUrl: imageUrl,
      gender,
      birth: convertedBirth,
    };
  };

  const submitRegisterRequest = async () => {
    try {
      const registerRequest: RegisterRequest = await createRegisterRequest();
      const res = await signUpApi(registerRequest);
      saveAccessToken(res.data.accessToken);
      saveRefreshToken(res.data.refreshToken);

      alert("회원가입이 완료되었습니다.");
      router.push("/");
    } catch (err) {
      if (err.response) {
        console.error("Axios response error", err.response);
        alert(err.response.data?.message);
      } else {
        console.error("Error", err.message);
        alert(err.message);
      }
    }
  };

  const renderCurrentSurvey = () => {
    switch (curStage) {
      case 1:
        return (
          <SignupPrepareScreen
            preparation={curPreparation}
            setPreparation={setCurPreparation}
            toNextStage={() => {
              setCurStage(2);
            }}
          />
        );
      case 2:
        return (
          <SignupRegionScreen
            curRegion={region}
            setCurRegion={setRegion}
            curCountries={countries}
            setCurCountries={setCountries}
            toNextStage={() => {
              setCurStage(3);
            }}
          />
        );
      case 3:
        return (
          <SignupProfileScreen
            toNextStage={submitRegisterRequest}
            nickname={nickname}
            setNickname={setNickname}
            gender={gender}
            setGender={setGender}
            birth={birth}
            setBirth={setBirth}
            defaultProfileImageUrl={baseProfileImageUrl}
            profileImageFile={profileImageFile}
            setProfileImageFile={setProfileImageFile}
          />
        );
      default:
        return <div>회원 가입이 완료되었습니다</div>;
    }
  };

  return <>{renderCurrentSurvey()}</>;
};

export default SignupSurvey;
