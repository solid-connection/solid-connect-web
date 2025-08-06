"use client";

import React from "react";

import { IconDirectionDown, IconDirectionUp } from "@/public/svgs/mentor";

type MentorWatingListBoxProps = {
  hasExpand?: boolean;
  className?: string;
  children: React.ReactNode | ((args: { isExpanded: boolean; toggle: () => void }) => React.ReactNode);
};

const MentorWatingListBox = ({ hasExpand = false, className = "", children }: MentorWatingListBoxProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const toggle = React.useCallback(() => setIsExpanded((p) => !p), []);

  const content =
    typeof children === "function"
      ? (children as (args: { isExpanded: boolean; toggle: () => void }) => React.ReactNode)({
          isExpanded,
          toggle,
        })
      : children;

  return (
    <div className={`rounded-md border border-gray-200 bg-white shadow-sm ${className}`}>
      {content}
      {hasExpand && (
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={toggle}
          className="flex w-full items-center justify-center border-t py-3 hover:bg-gray-50"
        >
          <span className="h-6 w-6">{isExpanded ? <IconDirectionUp /> : <IconDirectionDown />}</span>
        </button>
      )}
    </div>
  );
};

export default MentorWatingListBox;
