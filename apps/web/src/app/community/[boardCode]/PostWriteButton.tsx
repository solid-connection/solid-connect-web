"use client";

import { useEffect, useState } from "react";

import { IconObjectsAndTools } from "@/public/svgs";

type PostWriteButtonProps = {
  onClick: () => void;
};

const PostWriteButton = ({ onClick }: PostWriteButtonProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed bottom-16 flex w-full max-w-app flex-col items-center transition-transform duration-300 ease-in-out md:bottom-6 md:left-[88px] md:w-[calc(100%-88px)] md:max-w-none ${isVisible ? "translate-y-0" : "translate-y-[calc(100%+66px)]"} `}
    >
      <button
        className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary shadow-magic-floating-action"
        onClick={onClick}
        type="button"
        aria-label="글쓰기"
      >
        <div className="absolute -top-2 flex items-center justify-center">
          <IconObjectsAndTools />
        </div>
      </button>
    </div>
  );
};

export default PostWriteButton;
