import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-9 w-full rounded-md border border-k-200 bg-k-0 px-3 py-1 typo-regular-4 text-k-700 shadow-sm transition-colors file:border-0 file:bg-transparent file:typo-medium-4 file:text-k-700 placeholder:text-k-400 focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export { Input };
