"use client";

import clsx from "clsx";
import { COMMUNITY_POST_CATEGORIES } from "@/constants/community";

type PostCategorySelectorProps = {
  value: string;
  onChange: (category: string) => void;
};

const PostCategorySelector = ({ value, onChange }: PostCategorySelectorProps) => {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap">
      {COMMUNITY_POST_CATEGORIES.map((category) => {
        const isActive = category === value;

        return (
          <button
            key={category}
            type="button"
            className={clsx(
              "shrink-0 rounded-full px-3 py-1 leading-5 transition-all duration-200 ease-in-out typo-medium-2",
              isActive ? "bg-primary text-white" : "bg-k-50 text-k-300",
            )}
            onClick={() => onChange(category)}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default PostCategorySelector;
