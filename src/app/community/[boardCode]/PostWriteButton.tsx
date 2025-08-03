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
      className={`fixed bottom-16 flex w-full max-w-[600px] flex-col items-center transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "translate-y-[calc(100%+66px)]"} `}
    >
      <button
        className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary shadow-[0px_4px_30px_rgba(0,0,0,0.15)]"
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
