import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/utils/designUtils";

const blockBtnVariants = cva(
  "h-13 w-full min-w-80 max-w-screen-sm rounded-lg disabled:opacity-50 flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary/90",
      },
      text: {
        default: "text-base font-medium text-white",
      },
    },
    defaultVariants: {
      variant: "default",
      text: "default",
    },
  },
);

export interface BlockBtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof blockBtnVariants> {
  onClick: () => void;
  children: React.ReactNode;
}

const BlockBtn = React.forwardRef<HTMLButtonElement, BlockBtnProps>(
  ({ className, variant, onClick, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        type="button"
        className={cn(blockBtnVariants({ variant, className }))}
        {...props}
      >
        <span>{children}</span>
      </button>
    );
  },
);
BlockBtn.displayName = "BlockBtn";

export default BlockBtn;
