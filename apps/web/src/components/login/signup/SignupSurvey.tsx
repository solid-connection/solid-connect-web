"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePostSignUp } from "@/apis/Auth";
import { useUploadProfileImagePublic } from "@/apis/image-upload";
import { Progress } from "@/components/ui/Progress";
import { showIconToast } from "@/lib/toast/showIconToast";
import useAuthStore from "@/lib/zustand/useAuthStore";

import type { PreparationStatus, SignUpRequest } from "@/types/auth";
import type { RegionKo } from "@/types/university";
import {
  AUTH_REDIRECT_PARAM,
  getCommunityRedirectOrFallback,
  getSafeCommunityRedirectPath,
} from "@/utils/authRedirect";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import SignupPolicyScreen from "./SignupPolicyScreen";
import SignupPrepareScreen from "./SignupPrepareScreen";
import SignupProfileScreen from "./SignupProfileScreen";
import SignupRegionScreen from "./SignupRegionScreen";

type SignupSurveyProps = {
  baseNickname: string;
  baseEmail: string;
  baseProfileImageUrl: string;
};

type SignupScreenVariant = "mobile" | "desktop";

const SignupSurvey = ({ baseNickname, baseEmail, baseProfileImageUrl }: SignupSurveyProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const signUpToken = searchParams?.get("token");
  const redirectPath = getSafeCommunityRedirectPath(searchParams?.get(AUTH_REDIRECT_PARAM)) ?? undefined;
  const { setAccessToken } = useAuthStore();
  const isDesktop = useIsDesktopViewport();
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
    if (!signUpToken) {
      router.replace("/login");
    }
  }, [signUpToken, router]);

  useEffect(() => {
    setCurProgress(((curStage - 1) / 3) * 100);
  }, [curStage]);

  if (!signUpToken || isDesktop === null) {
    return null;
  }

  const variant: SignupScreenVariant = isDesktop ? "desktop" : "mobile";

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
      } catch (_error) {
        // 업로드 실패 토스트는 전역 onError에서 단일 처리
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
          showIconToast("logo", "회원가입이 완료되었습니다.");

          setTimeout(() => {
            router.push(getCommunityRedirectOrFallback(redirectPath));
          }, 100);
        },
      });
    } catch (err: unknown) {
      const error = err as { message?: string };
      showIconToast("logo", error.message || "회원가입에 실패했습니다.");
    }
  };

  const renderCurrentSurvey = () => {
    switch (curStage) {
      case 1:
        return (
          <SignupPolicyScreen
            variant={variant}
            toNextStage={() => {
              setCurStage(2);
            }}
          />
        );
      case 2:
        return (
          <SignupPrepareScreen
            variant={variant}
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
            variant={variant}
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
            variant={variant}
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

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
        <div className="grid min-h-[calc(100vh-64px)] items-center gap-8 xl:grid-cols-[minmax(420px,560px)_minmax(300px,380px)] xl:justify-center">
          <section className="rounded-lg border border-k-100 bg-white p-8">
            <p className="text-primary typo-sb-9">Sign up</p>
            <h1 className="mt-2 text-k-900 typo-bold-1">회원가입</h1>
            <p className="mt-2 text-k-500 typo-medium-2">
              관심 국가와 준비 단계를 입력해 맞춤형 솔커 계정을 완성하세요.
            </p>
            <Progress value={curProgress} className="mt-8" />
            <div className="mt-8">{renderCurrentSurvey()}</div>
          </section>

          <aside className="rounded-lg border border-k-100 bg-white p-6">
            <h2 className="text-k-900 typo-bold-4">가입 진행</h2>
            <div className="mt-5 grid gap-3">
              {["약관 동의", "준비 단계", "관심 국가", "프로필"].map((item, index) => (
                <div
                  key={item}
                  className={`rounded-lg px-4 py-3 typo-medium-2 ${
                    curStage >= index + 1 ? "bg-primary-100 text-primary" : "bg-k-50 text-k-500"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    );
  }

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
