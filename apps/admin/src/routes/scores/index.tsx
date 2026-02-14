import { createFileRoute, redirect } from "@tanstack/react-router";
import { Building2, FileText, Search, SquarePen, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { GpaScoreTable } from "@/components/features/scores/GpaScoreTable";
import { LanguageScoreTable } from "@/components/features/scores/LanguageScoreTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { isTokenExpired } from "@/lib/utils/jwtUtils";
import { loadAccessToken } from "@/lib/utils/localStorage";
import type { VerifyStatus } from "@/types/scores";

export const Route = createFileRoute("/scores/")({
	beforeLoad: () => {
		// 클라이언트 사이드에서만 인증 체크
		if (typeof window !== "undefined") {
			const token = loadAccessToken();
			if (!token || isTokenExpired(token)) {
				throw redirect({ to: "/auth/login" });
			}
		}
	},
	component: ScoresPage,
});

function ScoresPage() {
	const [verifyFilter, setVerifyFilter] = useState<VerifyStatus>("PENDING");
	const [searchKeyword, setSearchKeyword] = useState("");

	const sideMenus = [
		{ label: "대학 관리", icon: Building2, active: true },
		{ label: "멘토 관리", icon: UserCircle2, active: false },
		{ label: "유저 관리", icon: UserCircle2, active: false },
		{ label: "성적 관리", icon: FileText, active: false },
	] as const;

	const topTabs = ["권역/나라", "나라/대학", "대학 지원 정보", "대학 상세 정보"] as const;

	const verifyFilters: Array<{ value: VerifyStatus; label: string }> = [
		{ value: "PENDING", label: "대기중" },
		{ value: "APPROVED", label: "승인됨" },
		{ value: "REJECTED", label: "거절됨" },
	];

	return (
		<div className="mx-auto w-full max-w-[1280px] rounded-[24px] border border-slate-200 bg-white shadow-[0_16px_40px_-28px_rgba(15,23,42,0.45)]">
			<div className="flex min-h-[calc(100vh-96px)]">
				<aside className="flex w-[212px] flex-col border-r border-slate-100 bg-slate-50/70 px-5 py-7">
					<div className="mb-10">
						<p className="text-[11px] font-semibold text-indigo-400">Solid Connection</p>
						<h1 className="mt-1 text-[34px] font-extrabold leading-[1.04] tracking-[-0.03em] text-indigo-500">
							Admin
							<br />
							boards
						</h1>
					</div>

					<p className="mb-4 text-xs font-semibold text-slate-400">관리 메뉴</p>
					<nav className="space-y-1.5">
						{sideMenus.map((menu) => (
							<button
								key={menu.label}
								type="button"
								className={cn(
									"flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors",
									menu.active ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-white hover:text-slate-600",
								)}
							>
								<menu.icon className="h-4 w-4" />
								{menu.label}
							</button>
						))}
					</nav>
				</aside>

				<section className="flex-1 bg-slate-50/30 p-7">
					<div className="h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_24px_-22px_rgba(15,23,42,0.55)]">
						<div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 p-1">
							{topTabs.map((tab) => (
								<button
									key={tab}
									type="button"
									className={cn(
										"rounded-md px-3 py-1.5 text-xs font-semibold tracking-[-0.01em] transition-colors",
										tab === "권역/나라" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700",
									)}
								>
									{tab}
								</button>
							))}
						</div>

						<div className="mt-6 flex flex-wrap items-center gap-2">
							<h2 className="mr-auto text-xl font-bold tracking-[-0.02em] text-slate-800">권역/나라</h2>

							<div className="relative min-w-[300px] flex-1">
								<Input
									value={searchKeyword}
									onChange={(event) => setSearchKeyword(event.target.value)}
									placeholder="검색어를 입력한 후 검색할 카테고리를 선택해주세요"
									className="h-9 border-slate-200 bg-slate-50 pr-10 text-xs"
								/>
								<Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							</div>

							<Button
								type="button"
								className="h-9 rounded-md bg-indigo-500 px-3 text-xs text-white hover:bg-indigo-600"
							>
								<SquarePen className="h-3.5 w-3.5" />
								권역/나라 생성하기
							</Button>
						</div>

						<div className="mt-4 flex items-center gap-4">
							{verifyFilters.map((option) => (
								<button
									key={option.value}
									type="button"
									onClick={() => setVerifyFilter(option.value)}
									className={cn(
										"inline-flex items-center gap-2 text-xs font-medium transition-colors",
										verifyFilter === option.value ? "text-indigo-600" : "text-slate-400 hover:text-slate-600",
									)}
								>
									<span
										className={cn(
											"h-2.5 w-2.5 rounded-full border",
											verifyFilter === option.value ? "border-indigo-500 bg-indigo-500" : "border-slate-300 bg-white",
										)}
									/>
									{option.label}
								</button>
							))}
						</div>

						<div className="mt-5 rounded-xl border border-slate-100 bg-white p-3">
							<Tabs defaultValue="gpa">
								<TabsList className="h-9 rounded-md bg-slate-100 p-1">
									<TabsTrigger
										value="gpa"
										className="rounded-md px-4 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-indigo-600"
									>
										GPA 성적
									</TabsTrigger>
									<TabsTrigger
										value="language"
										className="rounded-md px-4 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-indigo-600"
									>
										어학성적
									</TabsTrigger>
								</TabsList>

								<TabsContent value="gpa" className="mt-3">
									<GpaScoreTable verifyFilter={verifyFilter} />
								</TabsContent>

								<TabsContent value="language" className="mt-3">
									<LanguageScoreTable verifyFilter={verifyFilter} />
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
