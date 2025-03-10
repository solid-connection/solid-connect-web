import * as React from "react";

import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@/utils/designUtils";

const inputVariants = cva(
  "border-input flex w-full px-3.5 py-2.5 rounded-md shadow-sm transition-colors placeholder:text-muted-foreground" +
    " file:text-foreground file:border-0 file:bg-transparent" +
    " focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-1" +
    " disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent border",
        gray: "bg-k-50 text-primary border-none font-semibold",
      },
      text: {
        default: "text-base file:text-sm file:font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
      text: "default",
    },
  },
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, variant, text, ...props }, ref) => {
  return <input type={type} className={cn(inputVariants({ className, variant, text }))} ref={ref} {...props} />;
});
Input.displayName = "Input";

export { Input };
