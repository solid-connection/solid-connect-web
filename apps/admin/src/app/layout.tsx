import type { ReactNode } from "react";
import "../styles.css";
import { Providers } from "./providers";

export const metadata = {
	title: "Solid Connection Admin",
	viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="ko">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
