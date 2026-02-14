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
		<div className="mx-auto w-full max-w-[1280px] rounded-[24px] border border-k-100 bg-k-0 shadow-sdw-a">
			<div className="flex min-h-[calc(100vh-96px)]">
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
						{sideMenus.map((menu) => (
							<button
								key={menu.label}
								type="button"
								className={cn(
									"flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left typo-medium-3 transition-colors",
									menu.active ? "bg-primary-100 text-primary" : "text-k-400 hover:bg-k-0 hover:text-k-700",
								)}
							>
								<menu.icon className="h-4 w-4" />
								{menu.label}
							</button>
						))}
					</nav>
				</aside>

				<section className="flex-1 bg-bg-50 p-7">
					<div className="h-full rounded-2xl border border-k-100 bg-k-0 p-6 shadow-[0_8px_24px_-22px_rgba(26,31,39,0.45)]">
						<div className="inline-flex items-center gap-1.5 rounded-lg bg-k-50 p-1">
							{topTabs.map((tab) => (
								<button
									key={tab}
									type="button"
									className={cn(
										"rounded-md px-3 py-1.5 typo-sb-11 tracking-[-0.01em] transition-colors",
										tab === "권역/나라" ? "bg-k-0 text-primary shadow-sm" : "text-k-500 hover:text-k-700",
									)}
								>
									{tab}
								</button>
							))}
						</div>

						<div className="mt-6 flex flex-wrap items-center gap-2">
							<h2 className="mr-auto typo-bold-4 tracking-[-0.01em] text-k-800">권역/나라</h2>

							<div className="relative min-w-[300px] flex-1">
								<Input
									value={searchKeyword}
									onChange={(event) => setSearchKeyword(event.target.value)}
									placeholder="검색어를 입력한 후 검색할 카테고리를 선택해주세요"
									className="h-9 border-k-100 bg-bg-50 pr-10 typo-regular-4 text-k-700"
								/>
								<Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-k-400" />
							</div>

							<Button type="button" className="h-9 rounded-md bg-primary px-3 typo-sb-11 text-k-0 hover:bg-primary-600">
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
										"inline-flex items-center gap-2 typo-medium-4 transition-colors",
										verifyFilter === option.value ? "text-primary" : "text-k-400 hover:text-k-600",
									)}
								>
									<span
										className={cn(
											"h-2.5 w-2.5 rounded-full border",
											verifyFilter === option.value ? "border-primary bg-primary" : "border-k-300 bg-k-0",
										)}
									/>
									{option.label}
								</button>
							))}
						</div>

						<div className="mt-5 rounded-xl border border-k-100 bg-k-0 p-3">
							<Tabs defaultValue="gpa">
								<TabsList className="h-9 rounded-md bg-k-50 p-1">
									<TabsTrigger
										value="gpa"
										className="rounded-md px-4 typo-sb-11 data-[state=active]:bg-k-0 data-[state=active]:text-primary"
									>
										GPA 성적
									</TabsTrigger>
									<TabsTrigger
										value="language"
										className="rounded-md px-4 typo-sb-11 data-[state=active]:bg-k-0 data-[state=active]:text-primary"
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
