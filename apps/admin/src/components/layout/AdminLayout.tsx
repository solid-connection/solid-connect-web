import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { clearSession } from "@/lib/auth/session";
import { type ActiveAdminMenu, AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
	children: React.ReactNode;
	activeMenu: ActiveAdminMenu;
	title: string;
	description?: string;
}

export function AdminLayout({ children, activeMenu, title, description }: AdminLayoutProps) {
	const navigate = useNavigate();

	const handleLogout = () => {
		clearSession();
		toast.success("로그아웃되었습니다.");
		void navigate({ to: "/auth/login" });
	};

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
					<div className="flex items-center gap-2">
						<p className="hidden rounded-full bg-bg-50 px-3 py-1 typo-medium-4 text-k-600 sm:block">운영 콘솔</p>
						<button
							type="button"
							onClick={handleLogout}
							className="inline-flex items-center gap-1 rounded-md border border-k-200 px-3 py-1.5 text-k-700 typo-medium-4 hover:bg-k-50"
						>
							<LogOut className="h-4 w-4" />
							로그아웃
						</button>
					</div>
				</header>

				<div className="flex min-h-[calc(100vh-96px)] overflow-hidden rounded-[24px] border border-k-100 bg-k-0 shadow-sdw-a">
					<AdminSidebar activeMenu={activeMenu} />
					<section className="flex-1 bg-bg-50 p-4 sm:p-6 lg:p-7">
						<div className="h-full rounded-2xl border border-k-100 bg-k-0 p-4 shadow-[0_8px_24px_-22px_rgba(26,31,39,0.45)] sm:p-6">
							<h1 className="typo-bold-1 text-k-900">{title}</h1>
							{description ? <p className="mt-1 typo-regular-4 text-k-500">{description}</p> : null}
							{children}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
