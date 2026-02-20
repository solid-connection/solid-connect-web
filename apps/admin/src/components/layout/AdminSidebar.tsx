import { Building2, FileText, FlaskConical, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
	activeMenu: "scores" | "bruno";
}

const sideMenus = [
	{ key: "university", label: "대학 관리", icon: Building2 },
	{ key: "mentor", label: "멘토 관리", icon: UserCircle2 },
	{ key: "user", label: "유저 관리", icon: UserCircle2 },
	{ key: "scores", label: "성적 관리", icon: FileText, to: "/scores" as const },
	{ key: "bruno", label: "Bruno API", icon: FlaskConical, to: "/bruno" as const },
] as const;

export function AdminSidebar({ activeMenu }: AdminSidebarProps) {
	return (
		<aside className="flex w-[212px] flex-col border-r border-k-100 bg-bg-100 px-5 py-7">
			<div className="mb-10">
				<p className="typo-sb-11 text-primary">Solid Connection</p>
				<h1 className="mt-1 typo-bold-1 tracking-[-0.03em] text-primary-700">
					Admin
					<br />
					boards
				</h1>
			</div>

			<p className="mb-4 typo-sb-11 text-k-400">관리 메뉴</p>
			<nav className="space-y-1.5">
				{sideMenus.map((menu) => {
					const isActive = menu.key === activeMenu;
					const menuClassName = cn(
						"flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left typo-medium-3 transition-colors",
						isActive ? "bg-primary-100 text-primary" : "text-k-400 hover:bg-k-0 hover:text-k-700",
					);

					if ("to" in menu) {
						return (
							<a key={menu.label} href={menu.to} className={menuClassName}>
								<menu.icon className="h-4 w-4" />
								{menu.label}
							</a>
						);
					}

					return (
						<button key={menu.label} type="button" className={menuClassName} disabled>
							<menu.icon className="h-4 w-4" />
							{menu.label}
						</button>
					);
				})}
			</nav>
		</aside>
	);
}
