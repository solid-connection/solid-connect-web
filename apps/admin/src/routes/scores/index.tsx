import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import { GpaScoreTable } from "@/components/features/scores/GpaScoreTable";
import { LanguageScoreTable } from "@/components/features/scores/LanguageScoreTable";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireAdminSession } from "@/lib/auth/session";
import type { VerifyStatus } from "@/types/scores";

export const Route = createFileRoute("/scores/")({
	beforeLoad: async () => {
		await requireAdminSession();
	},
	component: ScoresPage,
});

function ScoresPage() {
	const [verifyFilter, setVerifyFilter] = useState<VerifyStatus>("PENDING");
	const verifyFilterId = useId();

	return (
		<AdminLayout
			activeMenu="scores"
			title="성적 관리"
			description="원본 어드민 플로우를 기준으로 성적 검수 데이터를 관리합니다."
		>
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
		</AdminLayout>
	);
}
