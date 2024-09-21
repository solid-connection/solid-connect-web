import Link from "next/link";

import { IconNoProfileImage } from "../../../public/svgs";
import EditFilled from "../../components/ui/icon/EditFilled";

import { MyInfo } from "@/types/myInfo";

type MyProfileProps = {
  myInfo: MyInfo;
};

export default function MyProfile({ myInfo }: MyProfileProps) {
  const roleDisplay = {
    MENTO: "Mento",
    MENTEE: "Mentee",
  };
  return (
    <div className="flex h-[157px] gap-[38px] pt-[38px]">
      <div className="ml-5 h-[90px] w-[90px]">
        {myInfo.profileImageUrl ? (
          <img
            className="h-[90px] w-[90px] rounded-full object-cover"
            src={myInfo.profileImageUrl}
            alt="프로필 이미지"
          />
        ) : (
          <IconNoProfileImage />
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex gap-1.5">
          <div className="text-black font-serif text-xl font-bold leading-6">{myInfo.nickname || "닉네임"}</div>
          <Link href="/my/modify">
            <EditFilled />
          </Link>
        </div>
        <div className="mt-1 flex gap-[17px] font-serif text-sm leading-4 text-[#717171]">
          <div className="font-semibold">{myInfo.role in roleDisplay ? roleDisplay[myInfo.role] : "역할"}</div>
          <div className="font-medium">{myInfo.birth ? myInfo.birth.replace(/-/g, ".") : "1970.01.01"}</div>
        </div>
        <div className="mt-3 font-serif text-[12px] font-normal leading-4 text-[#717171]">{"inha university"}</div>
        <div className="mt-1 font-serif text-[12px] font-normal leading-4 text-[#717171]">{/* {"이메일"} */}</div>
      </div>
    </div>
  );
}
