interface AdminLayoutProps {
	children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eef2ff_0%,_#fafafa_48%,_#f5f5f5_100%)] text-k-800">
			<div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
				<header className="mb-4 flex items-center justify-between rounded-2xl border border-k-100 bg-k-0 px-4 py-3 shadow-[0_10px_30px_-24px_rgba(26,31,39,0.45)]">
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary typo-sb-9">
							SC
						</div>
						<div className="leading-tight">
							<p className="typo-medium-4 text-k-500">Solid Connection</p>
							<h1 className="typo-sb-7 text-k-900">Admin</h1>
						</div>
					</div>
					<p className="hidden rounded-full bg-bg-50 px-3 py-1 typo-medium-4 text-k-600 sm:block">운영 콘솔</p>
				</header>
				<main className="flex-1">{children}</main>
			</div>
		</div>
	);
}
