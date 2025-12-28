import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { type MyInfoResponse, useGetMyInfo, usePatchMyInfo } from "@/apis/MyPage";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod 스키마 정의 - 닉네임과 이미지
const profileSchema = z.object({
  nickname: z.string().min(1, "닉네임을 입력해주세요").max(20, "닉네임은 20자 이하로 입력해주세요"),
  file: z.instanceof(File).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UseModifyUserHookformReturn {
  methods: ReturnType<typeof useForm<ProfileFormData>>;
  myInfo?: Partial<MyInfoResponse>;
  onSubmit: (data: ProfileFormData) => void;
}

const useModifyUserHookform = (): UseModifyUserHookformReturn => {
  const { data: myInfo } = useGetMyInfo();

  const { mutate: patchMyInfo } = usePatchMyInfo();

  // React Hook Form 설정 - 닉네임만 관리
  const methods = useForm<ProfileFormData>({
    mode: "onChange", // 실시간 유효성 반영
    resolver: zodResolver(profileSchema),
  });

  const { reset } = methods;

  useEffect(() => {
    if (myInfo) {
      reset({
        nickname: myInfo.nickname || "",
      });
    }
  }, [myInfo]);

  // 폼 제출 시 닉네임과 이미지 함께 처리
  const onSubmit = (data: ProfileFormData) => {
    const updatedData: Partial<ProfileFormData> = {};

    if (data.nickname !== myInfo?.nickname) {
      updatedData.nickname = data.nickname;
    }

    if (data.file) {
      updatedData.file = data.file;
    }

    if (Object.keys(updatedData).length === 0) {
      return; // 변경 사항이 없으면 제출하지 않음
    }

    patchMyInfo(updatedData);
  };

  return {
    methods,
    myInfo,
    onSubmit,
  };
};
export default useModifyUserHookform;
