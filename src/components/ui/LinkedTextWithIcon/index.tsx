import Link from "next/link";

import { IconDirectionRight } from "@/public/svgs/mentor";

interface LinkedTextWithIconProps {
  href: string;
  icon?: React.ReactNode;
  text: string;
  subText?: string;
  textColor?: string;
}

const LinkedTextWithIcon = ({ href, icon, text, subText, textColor = "text-k-700" }: LinkedTextWithIconProps) => {
  return (
    <Link href={href} className="flex items-center justify-between px-3">
      {/* 왼쪽 아이콘 + 텍스트 */}
      <div className="flex flex-1 items-center gap-2">
        {icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full">
            <span className="h-5 w-5">{icon}</span>
          </div>
        ) : (
          <div className="h-10 w-1"></div>
        )}
        <span className={`font-medium ${textColor}`}>{text}</span>
      </div>

      {/* 오른쪽 subText + 아이콘 */}
      <div className="flex shrink-0 items-center gap-1">
        {subText && <span className="text-sm text-k-600">{subText}</span>}
        <span className="h-5 w-5">
          <IconDirectionRight />
        </span>
      </div>
    </Link>
  );
};

export default LinkedTextWithIcon;
