"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";

interface ProvidersProps {
	children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	return (
		<QueryProvider>
			{children}
			<Toaster />
		</QueryProvider>
	);
}
