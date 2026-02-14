interface AdminLayoutProps {
	children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
	return (
		<div className="min-h-screen bg-bg-50 text-k-800">
			<main className="p-6">{children}</main>
		</div>
	);
}
