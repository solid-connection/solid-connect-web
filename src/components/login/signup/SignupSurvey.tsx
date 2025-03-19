"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { signUpApi } from "@/services/auth";
import { uploadProfileImageFilePublicApi } from "@/services/file";
import { saveAccessToken, saveRefreshToken } from "@/utils/localStorage";

import SignupPolicyScreen from "./SignupPolicyScreen";
import SignupPrepareScreen from "./SignupPrepareScreen";
import SignupProfileScreen from "./SignupProfileScreen";
import SignupRegionScreen from "./SignupRegionScreen";

import { PreparationStatus, SignUpRequest } from "@/types/auth";
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
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const createRegisterRequest = async (): Promise<SignUpRequest> => {
    const submitRegion: RegionKo[] = region === "아직 잘 모르겠어요" ? [] : [region as RegionKo];

    if (!curPreparation) {
      throw new Error("준비 단계를 선택해주세요");
    }

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
    };
  };

  const submitRegisterRequest = async () => {
    try {
      const registerRequest = await createRegisterRequest();
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
          <SignupPolicyScreen
            toNextStage={() => {
              setCurStage(2);
            }}
          />
        );
      case 2:
        return (
          <SignupPrepareScreen
            preparation={curPreparation}
            setPreparation={setCurPreparation}
            toNextStage={() => {
              setCurStage(3);
            }}
          />
        );
      case 3:
        return (
          <SignupRegionScreen
            curRegion={region}
            setCurRegion={setRegion}
            curCountries={countries}
            setCurCountries={setCountries}
            toNextStage={() => {
              setCurStage(4);
            }}
          />
        );
      case 4:
        return (
          <SignupProfileScreen
            toNextStage={submitRegisterRequest}
            nickname={nickname}
            setNickname={setNickname}
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
