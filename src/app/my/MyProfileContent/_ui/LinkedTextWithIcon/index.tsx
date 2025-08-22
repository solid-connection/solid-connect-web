import Link from "next/link";
import React, { ReactNode } from "react";

interface LinkedTextWithIconProps {
  icon: ReactNode;
  text: string;
  href: string;
}

const LinkedTextWithIcon = ({ icon, text, href }: LinkedTextWithIconProps) => {
  return (
    <Link href={href} className="flex items-center gap-2 text-inherit no-underline">
      <span>{icon}</span>
      <span>{text}</span>
    </Link>
  );
};

export default LinkedTextWithIcon;
