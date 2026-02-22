import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, redirect, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { isTokenExpired } from "@/lib/utils/jwtUtils";
import { loadAccessToken } from "@/lib/utils/localStorage";

import appCss from "../styles.css?url";

const PUBLIC_PATHS = new Set(["/auth/login", "/login"]);

export const Route = createRootRoute({
	beforeLoad: ({ location }) => {
		if (typeof window === "undefined") {
			return;
		}

		const pathname = location.pathname;
		const isPublicPath = PUBLIC_PATHS.has(pathname);
		const accessToken = loadAccessToken();
		const isAuthenticated = accessToken !== null && !isTokenExpired(accessToken);

		if (!isAuthenticated && !isPublicPath) {
			throw redirect({ to: "/auth/login" });
		}

		if (isAuthenticated && isPublicPath) {
			throw redirect({ to: "/scores" });
		}
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Solid Connection Admin",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ko">
			<head>
				<HeadContent />
			</head>
			<body>
				<QueryProvider>{children}</QueryProvider>
				<Toaster />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
