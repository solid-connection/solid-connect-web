import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md typo-sb-11 transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-primary text-k-0 shadow-sm hover:bg-primary-600",
				destructive: "bg-[#E22A2D] text-k-0 shadow-sm hover:bg-[#BA1E21]",
				outline: "border border-k-200 bg-k-0 text-k-700 shadow-sm hover:bg-k-50",
				secondary: "bg-k-50 text-k-700 shadow-sm hover:bg-k-100",
				ghost: "text-k-600 hover:bg-k-50 hover:text-k-800",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-10 rounded-md px-8",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
