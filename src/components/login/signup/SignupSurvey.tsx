"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Progress } from "@/components/ui/Progress";

import SignupPolicyScreen from "./SignupPolicyScreen";
import SignupPrepareScreen from "./SignupPrepareScreen";
import SignupProfileScreen from "./SignupProfileScreen";
import SignupRegionScreen from "./SignupRegionScreen";

import { PreparationStatus, SignUpRequest } from "@/types/auth";
import { RegionKo } from "@/types/university";

import usePostSignUp from "@/api/auth/client/usePostSignUp";
import useUploadProfileImagePublic from "@/api/file/client/useUploadProfileImagePublic";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";

type SignupSurveyProps = {
  baseNickname: string;
  baseEmail: string;
  baseProfileImageUrl: string;
};

const SignupSurvey = ({ baseNickname, baseEmail, baseProfileImageUrl }: SignupSurveyProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const signUpToken = searchParams?.get("token");
  if (!signUpToken) {
    router.push("/login");
  }
  const { setAccessToken } = useAuthStore();
  const [curStage, setCurStage] = useState<number>(1);
  const [curProgress, setCurProgress] = useState<number>(0);

  const [curPreparation, setCurPreparation] = useState<PreparationStatus | null>(null);

  const [region, setRegion] = useState<RegionKo | "아직 잘 모르겠어요" | null>(null);
  const [countries, setCountries] = useState<string[]>([]);

  const [nickname, setNickname] = useState<string>(baseNickname);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const signUpMutation = usePostSignUp();
  const uploadImageMutation = useUploadProfileImagePublic();

  useEffect(() => {
    setCurProgress(((curStage - 1) / 3) * 100);
  }, [curStage]);

  const createRegisterRequest = async (): Promise<SignUpRequest> => {
    const submitRegion: RegionKo[] = region === "아직 잘 모르겠어요" ? [] : [region as RegionKo];

    if (!curPreparation) {
      throw new Error("준비 단계를 선택해주세요");
    }

    let imageUrl: string | null = baseProfileImageUrl;

    if (profileImageFile) {
      try {
        const result = await uploadImageMutation.mutateAsync(profileImageFile);
        imageUrl = result.fileUrl;
      } catch (err: any) {
        console.error("Error", err.message);
        // toast.error는 hook의 onError에서 이미 처리되므로 중복 호출 제거
      }
    }

    return {
      signUpToken: signUpToken as string,
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
      signUpMutation.mutate(registerRequest, {
        onSuccess: (data) => {
          setAccessToken(data.accessToken);
          toast.success("회원가입이 완료되었습니다.");
          router.push("/");
        },
        onError: (error: any) => {
          if (error.response) {
            console.error("Axios response error", error.response);
            toast.error(error.response.data?.message || "회원가입에 실패했습니다.");
          } else {
            console.error("Error", error.message);
            toast.error(error.message || "회원가입에 실패했습니다.");
          }
        },
      });
    } catch (err: any) {
      console.error("Error", err.message);
      toast.error(err.message || "회원가입에 실패했습니다.");
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

  return (
    <div>
      <div className="mt-8 px-5">
        <Progress value={curProgress} />
      </div>
      {renderCurrentSurvey()}
    </div>
  );
};

export default SignupSurvey;
