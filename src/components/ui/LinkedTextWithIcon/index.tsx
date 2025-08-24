import Link from "next/link";

import clsx from "clsx";

import { IconDirectionRight } from "@/public/svgs/mentor";

interface LinkedTextWithIconProps {
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  text: string;
  subText?: string;
  textColor?: string;
  isBilink?: boolean; // 양방향 링크 여부 (양방향 링크는 아이콘이 양쪽에 위치)
}

const LinkedTextWithIcon = ({
  href,
  onClick,
  icon,
  text,
  subText,
  textColor = "text-k-700",
  isBilink = false,
}: LinkedTextWithIconProps) => {
  // 타입 안정성을 위해 조건부로 렌더
  if (href) {
    return (
      <Link
        href={href}
        target={isBilink ? "_blank" : undefined}
        className="w-full"
        rel={isBilink ? "noopener noreferrer" : undefined}
      >
        {<Content icon={icon} text={text} subText={subText} textColor={textColor} />}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="w-full cursor-pointer">
      {<Content icon={icon} text={text} subText={subText} textColor={textColor} />}
    </button>
  );
};

export default LinkedTextWithIcon;

interface ContentProps {
  icon?: React.ReactNode;
  text: string;
  subText?: string;
  textColor?: string;
}

const Content = ({ icon, text, subText, textColor = "text-k-700" }: ContentProps) => {
  return (
    <div className="flex items-center justify-between px-3">
      {/* 왼쪽 아이콘 + 텍스트 */}
      <div className="flex flex-1 items-center gap-1">
        {icon ? (
          <div className="flex h-8 w-5 items-center justify-center rounded-full">
            <span className="h-5 w-5">{icon}</span>
          </div>
        ) : (
          <div className="h-8" />
        )}
        <span className={clsx("text-sm font-medium", textColor)}>{text}</span>
      </div>

      {/* 오른쪽 subText + 아이콘 */}
      <div className="flex shrink-0 items-center gap-1">
        {subText && <span className="text-sm text-k-600">{subText}</span>}
        <span className="h-5 w-5">
          <IconDirectionRight />
        </span>
      </div>
    </div>
  );
};
