import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/utils/designUtils";

const blockBtnVariants = cva("h-13 w-full min-w-80 max-w-screen-sm rounded-lg flex items-center justify-center", {
  variants: {
    variant: {
      default: "bg-primary hover:bg-primary/90 disabled:bg-k-100",
      secondary: "bg-secondary hover:bg-secondary/90 disabled:bg-k-100",
    },
    text: {
      default: "text-base font-medium text-white",
    },
  },
  defaultVariants: {
    variant: "default",
    text: "default",
  },
});

export interface BlockBtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof blockBtnVariants> {
  onClick: () => void;
  children: React.ReactNode;
}

const BlockBtn = React.forwardRef<HTMLButtonElement, BlockBtnProps>(
  ({ className, variant, text, children, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(blockBtnVariants({ variant, text, className }))} {...props}>
        <span>{children}</span>
      </button>
    );
  },
);
BlockBtn.displayName = "BlockBtn";

export default BlockBtn;
