import { createFileRoute, redirect } from "@tanstack/react-router";
import { useId, useState } from "react";
import { GpaScoreTable } from "@/components/features/scores/GpaScoreTable";
import { LanguageScoreTable } from "@/components/features/scores/LanguageScoreTable";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
	const verifyFilterId = useId();

	return (
		<AdminLayout>
			<div className="mx-auto w-full max-w-[1200px] rounded-2xl border border-k-100 bg-k-0 p-4 shadow-sdw-a sm:p-6">
				<h1 className="typo-bold-1 text-k-900">성적 관리</h1>

				<div className="mt-4">
					<label htmlFor={verifyFilterId} className="mb-1 block typo-sb-11 text-k-600">
						검수 상태
					</label>
					<select
						id={verifyFilterId}
						value={verifyFilter}
						onChange={(event) => setVerifyFilter(event.target.value as VerifyStatus)}
						className="h-9 min-w-[180px] rounded-md border border-k-200 bg-k-0 px-3 typo-regular-4 text-k-700 outline-none focus-visible:border-primary"
					>
						<option value="PENDING">대기중</option>
						<option value="APPROVED">승인됨</option>
						<option value="REJECTED">거절됨</option>
					</select>
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
		</AdminLayout>
	);
}
