"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HostUniversityTab } from "./tabs/HostUniversityTab";
import { UnivApplyInfoImportTab } from "./tabs/UnivApplyInfoImportTab";
import { UnivApplyInfoManageTab } from "./tabs/UnivApplyInfoManageTab";

export function UnivApplyInfosPageContent() {
	return (
		<AdminLayout
			activeMenu="univApplyInfos"
			title="지원 대학 관리"
			description="호스트 대학교와 지원 대학을 관리합니다."
		>
			<div className="mt-4">
				<Tabs defaultValue="hostUniversity">
					<TabsList>
						<TabsTrigger value="hostUniversity">호스트 대학교</TabsTrigger>
						<TabsTrigger value="import">지원 대학 가져오기</TabsTrigger>
						<TabsTrigger value="manage">지원 대학 관리</TabsTrigger>
					</TabsList>
					<TabsContent value="hostUniversity">
						<HostUniversityTab />
					</TabsContent>
					<TabsContent value="import">
						<UnivApplyInfoImportTab />
					</TabsContent>
					<TabsContent value="manage">
						<UnivApplyInfoManageTab />
					</TabsContent>
				</Tabs>
			</div>
		</AdminLayout>
	);
}
