import { createFileRoute, redirect } from "@tanstack/react-router";
import { Building2, Database, FileText, Search, SquarePen, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GpaScoreTable } from "@/components/features/scores/GpaScoreTable";
import { LanguageScoreTable } from "@/components/features/scores/LanguageScoreTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { adminApi } from "@/lib/api/admin";
import { cn } from "@/lib/utils";
import { isTokenExpired } from "@/lib/utils/jwtUtils";
import { loadAccessToken } from "@/lib/utils/localStorage";
import type { VerifyStatus } from "@/types/scores";

type Region = { code: string; koreanName: string };
type Country = { code: string; koreanName: string; regionCode: string };

const toPrettyJson = (value: unknown) => JSON.stringify(value, null, 2);

export const Route = createFileRoute("/scores/")({
	beforeLoad: () => {
		if (typeof window !== "undefined") {
			const token = loadAccessToken();
			if (!token || isTokenExpired(token)) {
				throw redirect({ to: "/auth/login" });
			}
		}
	},
	component: AdminApiDashboardPage,
});

function AdminApiDashboardPage() {
	const [verifyFilter, setVerifyFilter] = useState<VerifyStatus>("PENDING");
	const [searchKeyword, setSearchKeyword] = useState("");

	const [mentorStatus, setMentorStatus] = useState("PENDING");
	const [mentorPage, setMentorPage] = useState("1");
	const [mentorSize, setMentorSize] = useState("10");
	const [mentorNickname, setMentorNickname] = useState("");
	const [mentorCreatedAt, setMentorCreatedAt] = useState("");
	const [mentorListResult, setMentorListResult] = useState<unknown>(null);
	const [mentorCountResult, setMentorCountResult] = useState<unknown>(null);
	const [historySiteUserId, setHistorySiteUserId] = useState("");
	const [mentorHistoryResult, setMentorHistoryResult] = useState<unknown>(null);
	const [actionMentorId, setActionMentorId] = useState("");
	const [rejectReason, setRejectReason] = useState("");
	const [assignUniversityId, setAssignUniversityId] = useState("");
	const [mentorActionResult, setMentorActionResult] = useState<unknown>(null);

	const [regions, setRegions] = useState<Region[]>([]);
	const [countries, setCountries] = useState<Country[]>([]);
	const [regionCode, setRegionCode] = useState("");
	const [regionName, setRegionName] = useState("");
	const [countryCode, setCountryCode] = useState("");
	const [countryName, setCountryName] = useState("");
	const [countryRegionCode, setCountryRegionCode] = useState("");
	const [regionActionResult, setRegionActionResult] = useState<unknown>(null);

	const sideMenus = [
		{ label: "대학 관리", icon: Building2, active: true },
		{ label: "멘토 관리", icon: UserCircle2, active: true },
		{ label: "유저 관리", icon: UserCircle2, active: false },
		{ label: "성적 관리", icon: FileText, active: true },
	] as const;

	const topTabs = ["권역/나라", "멘토 지원", "성적 검증", "API 응답"] as const;

	const verifyFilters: Array<{ value: VerifyStatus; label: string }> = [
		{ value: "PENDING", label: "대기중" },
		{ value: "APPROVED", label: "승인됨" },
		{ value: "REJECTED", label: "거절됨" },
	];

	const handleError = (message: string, error: unknown) => {
		console.error(message, error);
		toast.error(message);
	};

	const fetchMentorApplications = async () => {
		try {
			const res = await adminApi.getMentorApplicationList({
				page: Number.parseInt(mentorPage, 10) || 1,
				size: Number.parseInt(mentorSize, 10) || 10,
				mentorApplicationStatus: mentorStatus || undefined,
				nickname: mentorNickname || undefined,
				createdAt: mentorCreatedAt || undefined,
			});
			setMentorListResult(res);
			toast.success("멘토 지원 목록 조회 완료");
		} catch (error) {
			handleError("멘토 지원 목록 조회 실패", error);
		}
	};

	const fetchMentorCount = async () => {
		try {
			const res = await adminApi.getCountMentorApplicationByStatus();
			setMentorCountResult(res);
			toast.success("멘토 상태 카운트 조회 완료");
		} catch (error) {
			handleError("멘토 상태 카운트 조회 실패", error);
		}
	};

	const fetchMentorHistory = async () => {
		if (!historySiteUserId) {
			toast.error("site_user_id를 입력해주세요.");
			return;
		}

		try {
			const res = await adminApi.getMentorApplicationHistoryList(historySiteUserId);
			setMentorHistoryResult(res);
			toast.success("멘토 지원 히스토리 조회 완료");
		} catch (error) {
			handleError("멘토 지원 히스토리 조회 실패", error);
		}
	};

	const approveMentor = async () => {
		if (!actionMentorId) {
			toast.error("mentorApplicationId를 입력해주세요.");
			return;
		}

		try {
			const res = await adminApi.postApproveMentorApplication(actionMentorId);
			setMentorActionResult(res);
			toast.success("멘토 지원 승인 완료");
		} catch (error) {
			handleError("멘토 지원 승인 실패", error);
		}
	};

	const rejectMentor = async () => {
		if (!actionMentorId || !rejectReason) {
			toast.error("mentorApplicationId와 거절 사유를 입력해주세요.");
			return;
		}

		try {
			const res = await adminApi.postRejectMentorApplication(actionMentorId, rejectReason);
			setMentorActionResult(res);
			toast.success("멘토 지원 거절 완료");
		} catch (error) {
			handleError("멘토 지원 거절 실패", error);
		}
	};

	const assignUniversity = async () => {
		if (!actionMentorId || !assignUniversityId) {
			toast.error("mentorApplicationId와 universityId를 입력해주세요.");
			return;
		}

		try {
			const res = await adminApi.postMappingMentorapplicationUniversity(
				actionMentorId,
				Number.parseInt(assignUniversityId, 10),
			);
			setMentorActionResult(res);
			toast.success("대학 매핑 완료");
		} catch (error) {
			handleError("대학 매핑 실패", error);
		}
	};

	const fetchRegions = async () => {
		try {
			const res = await adminApi.get권역조회();
			const nextRegions = Array.isArray(res) ? (res as Region[]) : [];
			setRegions(nextRegions);
			setRegionActionResult(res);
			toast.success("권역 조회 완료");
		} catch (error) {
			handleError("권역 조회 실패", error);
		}
	};

	const createRegion = async () => {
		if (!regionName) {
			toast.error("권역명을 입력해주세요.");
			return;
		}

		try {
			const res = await adminApi.post권역생성({ code: regionCode || undefined, koreanName: regionName });
			setRegionActionResult(res);
			toast.success("권역 생성 완료");
			await fetchRegions();
		} catch (error) {
			handleError("권역 생성 실패", error);
		}
	};

	const updateRegion = async () => {
		if (!regionCode || !regionName) {
			toast.error("수정할 권역 코드와 이름을 입력해주세요.");
			return;
		}

		try {
			const res = await adminApi.put권역수정(regionCode, { code: regionCode, koreanName: regionName });
			setRegionActionResult(res);
			toast.success("권역 수정 완료");
			await fetchRegions();
		} catch (error) {
			handleError("권역 수정 실패", error);
		}
	};

	const deleteRegion = async () => {
		if (!regionCode) {
			toast.error("삭제할 권역 코드를 입력해주세요.");
			return;
		}

		try {
			const res = await adminApi.delete권역삭제(regionCode);
			setRegionActionResult(res);
			toast.success("권역 삭제 완료");
			await fetchRegions();
		} catch (error) {
			handleError("권역 삭제 실패", error);
		}
	};

	const fetchCountries = async () => {
		try {
			const res = await adminApi.get지역조회();
			const nextCountries = Array.isArray(res) ? (res as Country[]) : [];
			setCountries(nextCountries);
			setRegionActionResult(res);
			toast.success("지역 조회 완료");
		} catch (error) {
			handleError("지역 조회 실패", error);
		}
	};

	const createCountry = async () => {
		if (!countryName || !countryRegionCode) {
			toast.error("지역명과 권역 코드를 입력해주세요.");
			return;
		}

		try {
			const res = await adminApi.post지역생성({
				code: countryCode || undefined,
				koreanName: countryName,
				regionCode: countryRegionCode,
			});
			setRegionActionResult(res);
			toast.success("지역 생성 완료");
			await fetchCountries();
		} catch (error) {
			handleError("지역 생성 실패", error);
		}
	};

	const updateCountry = async () => {
		if (!countryCode || !countryName || !countryRegionCode) {
			toast.error("수정할 지역 코드/이름/권역 코드를 입력해주세요.");
			return;
		}

		try {
			const res = await adminApi.put지역수정(countryCode, {
				code: countryCode,
				koreanName: countryName,
				regionCode: countryRegionCode,
			});
			setRegionActionResult(res);
			toast.success("지역 수정 완료");
			await fetchCountries();
		} catch (error) {
			handleError("지역 수정 실패", error);
		}
	};

	const deleteCountry = async () => {
		if (!countryCode) {
			toast.error("삭제할 지역 코드를 입력해주세요.");
			return;
		}

		try {
			const res = await adminApi.delete지역삭제(countryCode);
			setRegionActionResult(res);
			toast.success("지역 삭제 완료");
			await fetchCountries();
		} catch (error) {
			handleError("지역 삭제 실패", error);
		}
	};

	return (
		<div className="mx-auto w-full max-w-[1440px] rounded-[24px] border border-k-100 bg-k-0 shadow-sdw-a">
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
										["권역/나라", "멘토 지원"].includes(tab)
											? "bg-k-0 text-primary shadow-sm"
											: "text-k-500 hover:text-k-700",
									)}
								>
									{tab}
								</button>
							))}
						</div>

						<div className="mt-6 flex flex-wrap items-center gap-2">
							<h2 className="mr-auto typo-bold-4 tracking-[-0.01em] text-k-800">Admin API 통합 대시보드</h2>

							<div className="relative min-w-[300px] flex-1">
								<Input
									value={searchKeyword}
									onChange={(event) => setSearchKeyword(event.target.value)}
									placeholder="필터 키워드(시각적 보조용)"
									className="h-9 border-k-100 bg-bg-50 pr-10 typo-regular-4 text-k-700"
								/>
								<Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-k-400" />
							</div>

							<Button type="button" className="h-9 rounded-md bg-primary px-3 typo-sb-11 text-k-0 hover:bg-primary-600">
								<SquarePen className="h-3.5 w-3.5" />
								기능 연결 완료
							</Button>
						</div>

						<Tabs defaultValue="mentor" className="mt-5">
							<TabsList className="h-9 rounded-md bg-k-50 p-1">
								<TabsTrigger
									value="mentor"
									className="rounded-md px-4 typo-sb-11 data-[state=active]:bg-k-0 data-[state=active]:text-primary"
								>
									멘토 지원 API (6)
								</TabsTrigger>
								<TabsTrigger
									value="regions"
									className="rounded-md px-4 typo-sb-11 data-[state=active]:bg-k-0 data-[state=active]:text-primary"
								>
									권역/지역 API (8)
								</TabsTrigger>
								<TabsTrigger
									value="scores"
									className="rounded-md px-4 typo-sb-11 data-[state=active]:bg-k-0 data-[state=active]:text-primary"
								>
									성적 API (4)
								</TabsTrigger>
							</TabsList>

							<TabsContent value="mentor" className="mt-4 space-y-4">
								<div className="grid gap-4 lg:grid-cols-2">
									<div className="rounded-xl border border-k-100 bg-bg-50 p-4">
										<h3 className="mb-3 flex items-center gap-2 typo-sb-9 text-k-800">
											<UserCircle2 className="h-4 w-4" />
											멘토 지원 목록/카운트/히스토리 조회
										</h3>
										<div className="grid grid-cols-2 gap-2">
											<Input
												value={mentorStatus}
												onChange={(e) => setMentorStatus(e.target.value)}
												placeholder="status"
											/>
											<Input value={mentorPage} onChange={(e) => setMentorPage(e.target.value)} placeholder="page" />
											<Input value={mentorSize} onChange={(e) => setMentorSize(e.target.value)} placeholder="size" />
											<Input
												value={mentorNickname}
												onChange={(e) => setMentorNickname(e.target.value)}
												placeholder="nickname"
											/>
										</div>
										<Input
											className="mt-2"
											value={mentorCreatedAt}
											onChange={(e) => setMentorCreatedAt(e.target.value)}
											placeholder="createdAt (YYYY-MM-DD)"
										/>
										<div className="mt-2 flex flex-wrap gap-2">
											<Button type="button" onClick={fetchMentorApplications}>
												목록 조회
											</Button>
											<Button type="button" variant="secondary" onClick={fetchMentorCount}>
												상태 카운트
											</Button>
										</div>
										<div className="mt-3 flex gap-2">
											<Input
												value={historySiteUserId}
												onChange={(e) => setHistorySiteUserId(e.target.value)}
												placeholder="site_user_id"
											/>
											<Button type="button" variant="outline" onClick={fetchMentorHistory}>
												히스토리 조회
											</Button>
										</div>
									</div>

									<div className="rounded-xl border border-k-100 bg-bg-50 p-4">
										<h3 className="mb-3 typo-sb-9 text-k-800">멘토 지원 승인/거절/대학 매핑</h3>
										<Input
											value={actionMentorId}
											onChange={(e) => setActionMentorId(e.target.value)}
											placeholder="mentorApplicationId"
										/>
										<div className="mt-2 flex flex-wrap gap-2">
											<Button type="button" onClick={approveMentor}>
												승인
											</Button>
											<Button type="button" variant="destructive" onClick={rejectMentor}>
												거절
											</Button>
										</div>
										<Textarea
											className="mt-2"
											value={rejectReason}
											onChange={(e) => setRejectReason(e.target.value)}
											placeholder="거절 사유"
										/>
										<div className="mt-2 flex gap-2">
											<Input
												value={assignUniversityId}
												onChange={(e) => setAssignUniversityId(e.target.value)}
												placeholder="universityId"
											/>
											<Button type="button" variant="outline" onClick={assignUniversity}>
												대학 매핑
											</Button>
										</div>
									</div>
								</div>

								<div className="grid gap-4 lg:grid-cols-2">
									<div className="rounded-xl border border-k-100 bg-k-0 p-3">
										<p className="mb-2 typo-sb-11 text-k-700">멘토 지원 목록 응답</p>
										<Textarea
											readOnly
											value={mentorListResult ? toPrettyJson(mentorListResult) : "{}"}
											className="min-h-56 font-mono"
										/>
									</div>
									<div className="rounded-xl border border-k-100 bg-k-0 p-3">
										<p className="mb-2 typo-sb-11 text-k-700">카운트/히스토리/액션 응답</p>
										<Textarea
											readOnly
											value={
												mentorActionResult || mentorCountResult || mentorHistoryResult
													? toPrettyJson({ mentorCountResult, mentorHistoryResult, mentorActionResult })
													: "{}"
											}
											className="min-h-56 font-mono"
										/>
									</div>
								</div>
							</TabsContent>

							<TabsContent value="regions" className="mt-4 space-y-4">
								<div className="grid gap-4 lg:grid-cols-2">
									<div className="rounded-xl border border-k-100 bg-bg-50 p-4">
										<h3 className="mb-3 flex items-center gap-2 typo-sb-9 text-k-800">
											<Database className="h-4 w-4" />
											권역 API (조회/생성/수정/삭제)
										</h3>
										<div className="grid grid-cols-2 gap-2">
											<Input value={regionCode} onChange={(e) => setRegionCode(e.target.value)} placeholder="code" />
											<Input
												value={regionName}
												onChange={(e) => setRegionName(e.target.value)}
												placeholder="koreanName"
											/>
										</div>
										<div className="mt-2 flex flex-wrap gap-2">
											<Button type="button" onClick={fetchRegions}>
												조회
											</Button>
											<Button type="button" variant="secondary" onClick={createRegion}>
												생성
											</Button>
											<Button type="button" variant="outline" onClick={updateRegion}>
												수정
											</Button>
											<Button type="button" variant="destructive" onClick={deleteRegion}>
												삭제
											</Button>
										</div>

										<div className="mt-3 rounded-md border border-k-100 bg-k-0 p-2">
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>권역 코드</TableHead>
														<TableHead>권역명</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{regions.length === 0 ? (
														<TableRow>
															<TableCell colSpan={2} className="text-center text-k-500">
																권역 데이터 없음
															</TableCell>
														</TableRow>
													) : (
														regions.map((region) => (
															<TableRow key={region.code}>
																<TableCell>{region.code}</TableCell>
																<TableCell>{region.koreanName}</TableCell>
															</TableRow>
														))
													)}
												</TableBody>
											</Table>
										</div>
									</div>

									<div className="rounded-xl border border-k-100 bg-bg-50 p-4">
										<h3 className="mb-3 flex items-center gap-2 typo-sb-9 text-k-800">
											<Database className="h-4 w-4" />
											지역 API (조회/생성/수정/삭제)
										</h3>
										<div className="grid grid-cols-3 gap-2">
											<Input value={countryCode} onChange={(e) => setCountryCode(e.target.value)} placeholder="code" />
											<Input
												value={countryName}
												onChange={(e) => setCountryName(e.target.value)}
												placeholder="koreanName"
											/>
											<Input
												value={countryRegionCode}
												onChange={(e) => setCountryRegionCode(e.target.value)}
												placeholder="regionCode"
											/>
										</div>
										<div className="mt-2 flex flex-wrap gap-2">
											<Button type="button" onClick={fetchCountries}>
												조회
											</Button>
											<Button type="button" variant="secondary" onClick={createCountry}>
												생성
											</Button>
											<Button type="button" variant="outline" onClick={updateCountry}>
												수정
											</Button>
											<Button type="button" variant="destructive" onClick={deleteCountry}>
												삭제
											</Button>
										</div>

										<div className="mt-3 rounded-md border border-k-100 bg-k-0 p-2">
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>지역 코드</TableHead>
														<TableHead>지역명</TableHead>
														<TableHead>권역 코드</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{countries.length === 0 ? (
														<TableRow>
															<TableCell colSpan={3} className="text-center text-k-500">
																지역 데이터 없음
															</TableCell>
														</TableRow>
													) : (
														countries.map((country) => (
															<TableRow key={country.code}>
																<TableCell>{country.code}</TableCell>
																<TableCell>{country.koreanName}</TableCell>
																<TableCell>{country.regionCode}</TableCell>
															</TableRow>
														))
													)}
												</TableBody>
											</Table>
										</div>
									</div>
								</div>

								<div className="rounded-xl border border-k-100 bg-k-0 p-3">
									<p className="mb-2 typo-sb-11 text-k-700">권역/지역 API 응답</p>
									<Textarea
										readOnly
										value={regionActionResult ? toPrettyJson(regionActionResult) : "{}"}
										className="min-h-48 font-mono"
									/>
								</div>
							</TabsContent>

							<TabsContent value="scores" className="mt-4 space-y-4">
								<div className="flex items-center gap-4">
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

								<div className="rounded-xl border border-k-100 bg-k-0 p-3">
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
							</TabsContent>
						</Tabs>
					</div>
				</section>
			</div>
		</div>
	);
}
