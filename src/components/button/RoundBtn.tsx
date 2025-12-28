import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const roundBtnVariants = cva("h-[2.375rem] w-[6.375rem] rounded-3xl px-4 py-2.5 ", {
  variants: {
    variant: {
      default: "bg-primary hover:bg-primary/90 text-k-0",
      secondary: "bg-secondary hover:bg-secondary/90 text-k-0",
      "secondary-400": "bg-secondary-400 hover:bg-secondary-400/90 text-k-0",
      inactive: "bg-k-100 hover:bg-k-100/90 text-k-0",
    },
    text: {
      default: "typo-bold-6",
    },
  },
  defaultVariants: {
    variant: "default",
    text: "default",
  },
});

export interface RoundBtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof roundBtnVariants> {
  onClick?: () => void;
  children: React.ReactNode;
}

const RoundBtn = React.forwardRef<HTMLButtonElement, RoundBtnProps>(
  ({ className, variant, text, children, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(roundBtnVariants({ variant, text, className }))} {...props}>
        <span>{children}</span>
      </button>
    );
  },
);
RoundBtn.displayName = "RoundBtn";

export default RoundBtn;
