"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";
import { cn } from "@/lib/utils";

interface ExtendedProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  showPercentage?: boolean;
  percentageClassName?: string;
  showIndicator?: boolean;
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ExtendedProgressProps>(
  ({ className, value, showPercentage = true, percentageClassName, showIndicator = true, ...props }, ref) => (
    <div className="relative">
      {showPercentage && (
        <div
          className={cn("absolute -top-5 text-primary transition-all typo-medium-4", percentageClassName)}
          style={{
            left: `${value || 0}%`,
            transform: `translateX(-50%)`,
          }}
        >
          {Math.round(value || 0)}%
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn("relative h-[0.3125rem] w-full overflow-hidden rounded-full bg-k-100", className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="h-full w-full flex-1 bg-primary transition-all"
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showIndicator && (
        <div
          className="absolute top-1/2 h-2.5 w-2.5 rounded-full bg-primary shadow-sm"
          style={{
            left: `${value || 0}%`,
            transform: `translate(-50%, -50%)`,
          }}
        />
      )}
    </div>
  ),
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
