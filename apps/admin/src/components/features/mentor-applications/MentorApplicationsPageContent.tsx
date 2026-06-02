"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminApi } from "@/lib/api/admin";
import { normalizeImageUrlToUploadCdn } from "@/lib/utils/cdnUrl";
import type {
	AdminSiteUserResponse,
	AdminUniversityResponse,
	MentorApplicationCoreResponse,
	MentorApplicationHistoryResponse,
	MentorApplicationListItem,
	MentorApplicationStatus,
} from "@/types/mentorApplications";

const PAGE_SIZE = 10;
const STATUS_OPTIONS: { value: MentorApplicationStatus; label: string }[] = [
	{ value: "PENDING", label: "대기중" },
	{ value: "APPROVED", label: "승인됨" },
	{ value: "REJECTED", label: "거절됨" },
];

const statusStyles: Record<MentorApplicationStatus, string> = {
	PENDING: "bg-primary-100 text-primary",
	APPROVED: "bg-magic-success-surface text-magic-success",
	REJECTED: "bg-magic-danger-surface text-magic-danger",
};

const statusLabels: Record<MentorApplicationStatus, string> = {
	PENDING: "대기중",
	APPROVED: "승인됨",
	REJECTED: "거절됨",
};

const toOptionalString = (value: string | number | null | undefined) => {
	if (value === null || value === undefined) return undefined;
	const normalized = String(value).trim();
	return normalized.length > 0 ? normalized : undefined;
};

const pickString = (...values: (string | number | null | undefined)[]) => {
	for (const value of values) {
		const normalized = toOptionalString(value);
		if (normalized) return normalized;
	}

	return undefined;
};

const toDisplayText = (value: string | number | null | undefined) => toOptionalString(value) ?? "-";

const normalizeUploadUrl = (value: string | number | null | undefined) => {
	const url = toOptionalString(value);
	if (!url) return "";

	if (url.startsWith("/") && !url.startsWith("//")) {
		return normalizeImageUrlToUploadCdn(url.replace(/^\/+/, ""));
	}

	return normalizeImageUrlToUploadCdn(url);
};

const isMentorApplicationStatus = (value: unknown): value is MentorApplicationStatus => {
	if (typeof value !== "string") return false;
	return STATUS_OPTIONS.some((option) => option.value === value.toUpperCase());
};

const normalizeStatus = (value: unknown): MentorApplicationStatus | null => {
	if (!isMentorApplicationStatus(value)) return null;
	return value.toUpperCase() as MentorApplicationStatus;
};

const getApplicationCore = (application: MentorApplicationListItem): MentorApplicationCoreResponse =>
	application.mentorApplicationResponse ?? application.mentorApplication ?? application;

const getSiteUser = (application: MentorApplicationListItem): AdminSiteUserResponse | undefined =>
	application.siteUserResponse ?? application.siteUser ?? application.user ?? undefined;

const getUniversity = (application: MentorApplicationListItem): AdminUniversityResponse | undefined =>
	application.universityResponse ?? application.university ?? undefined;

const getApplicationId = (application: MentorApplicationListItem) => {
	const core = getApplicationCore(application);
	return pickString(core.id, core.mentorApplicationId, application.id, application.mentorApplicationId);
};

const getSiteUserId = (application: MentorApplicationListItem) => {
	const core = getApplicationCore(application);
	const user = getSiteUser(application);
	return pickString(user?.id, user?.siteUserId, core.siteUserId, application.siteUserId);
};

const getNickname = (application: MentorApplicationListItem) => {
	const user = getSiteUser(application);
	return pickString(user?.nickname, user?.name, user?.email) ?? "-";
};

const getProfileImageUrl = (application: MentorApplicationListItem) => {
	const user = getSiteUser(application);
	return normalizeUploadUrl(user?.profileImageUrl);
};

const getApplicationStatus = (application: MentorApplicationListItem) => {
	const core = getApplicationCore(application);
	return normalizeStatus(core.mentorApplicationStatus) ?? normalizeStatus(core.status);
};

const getCountry = (application: MentorApplicationListItem) => {
	const core = getApplicationCore(application);
	const university = getUniversity(application);
	return pickString(core.countryName, core.country, university?.countryName, university?.country);
};

const getUniversityName = (application: MentorApplicationListItem) => {
	const core = getApplicationCore(application);
	const university = getUniversity(application);
	return pickString(core.universityName, university?.koreanName, university?.name, core.universityId, university?.id);
};

const getUniversityId = (application: MentorApplicationListItem) => {
	const core = getApplicationCore(application);
	const university = getUniversity(application);
	return pickString(core.universityId, university?.universityId, university?.id);
};

const getTerm = (application: MentorApplicationListItem) => {
	const core = getApplicationCore(application);
	return pickString(core.term);
};

const getRejectedReason = (application: MentorApplicationListItem) => {
	const core = getApplicationCore(application);
	return pickString(core.rejectedReason);
};

const getCreatedAt = (application: MentorApplicationListItem) => {
	const core = getApplicationCore(application);
	return pickString(core.createdAt, application.createdAt);
};

const getVerificationFileUrl = (application: MentorApplicationListItem) => {
	const core = getApplicationCore(application);
	const file = core.verificationFile;

	if (typeof file === "string") {
		return normalizeUploadUrl(file);
	}

	return normalizeUploadUrl(
		pickString(
			file?.url,
			file?.fileUrl,
			file?.path,
			core.verificationFileUrl,
			core.verificationFilePath,
			core.fileUrl,
			core.proofFileUrl,
			application.verificationFileUrl,
			application.fileUrl,
			application.proofFileUrl,
		),
	);
};

const formatDateTime = (value: string | number | null | undefined) => {
	const normalized = toOptionalString(value);
	if (!normalized) return "-";

	const date = new Date(normalized);
	if (Number.isNaN(date.getTime())) return normalized;

	return format(date, "yyyy-MM-dd HH:mm");
};

const getHistoryItems = (data: MentorApplicationHistoryResponse | undefined) => {
	if (!data) return [];
	return Array.isArray(data) ? data : (data.content ?? []);
};

type MentorApplicationCountData = Awaited<ReturnType<typeof adminApi.getCountMentorApplicationByStatus>>;

const toCountNumber = (value: unknown): number | undefined => {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && value.trim().length > 0) {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : undefined;
	}
	if (typeof value === "object" && value !== null) {
		const record = value as Record<string, unknown>;
		return toCountNumber(record.count ?? record.total ?? record.value);
	}

	return undefined;
};

const getCountByStatus = (data: MentorApplicationCountData | undefined, status: MentorApplicationStatus) => {
	if (!data) return undefined;

	if (Array.isArray(data)) {
		const item = data.find(
			(entry) => normalizeStatus(entry.mentorApplicationStatus ?? entry.status ?? entry.name) === status,
		);
		return toCountNumber(item);
	}

	const record = data as Record<string, unknown>;
	const collection = record.content ?? record.data ?? record.items ?? record.result;
	if (Array.isArray(collection)) {
		const item = collection.find((entry) => {
			if (typeof entry !== "object" || entry === null) return false;
			const nextRecord = entry as Record<string, unknown>;
			return normalizeStatus(nextRecord.mentorApplicationStatus ?? nextRecord.status ?? nextRecord.name) === status;
		});
		return toCountNumber(item);
	}

	return toCountNumber(record[status] ?? record[status.toLowerCase()]);
};

function MentorApplicationStatusBadge({ status }: { status: MentorApplicationStatus | null }) {
	if (!status) {
		return <span className="inline-flex rounded-full bg-k-50 px-2.5 py-0.5 typo-medium-4 text-k-500">-</span>;
	}

	return (
		<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 typo-medium-4 ${statusStyles[status]}`}>
			{statusLabels[status]}
		</span>
	);
}

function MentorApplicationHistoryRow({ colSpan, siteUserId }: { colSpan: number; siteUserId: string }) {
	const { data, isError, isLoading } = useQuery({
		queryKey: ["mentorApplications", "history", siteUserId],
		queryFn: () => adminApi.getMentorApplicationHistoryList(siteUserId),
	});

	const historyItems = getHistoryItems(data);

	return (
		<TableRow className="bg-bg-50 hover:bg-bg-50">
			<TableCell colSpan={colSpan} className="p-4">
				<div className="rounded-lg border border-k-100 bg-k-0 p-3">
					<p className="mb-3 typo-sb-11 text-k-700">신청 이력</p>
					{isLoading ? (
						<div className="flex items-center justify-center py-6">
							<div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary" />
							<span className="ml-2 typo-regular-4 text-k-500">이력을 불러오는 중...</span>
						</div>
					) : isError ? (
						<p className="py-4 text-center typo-regular-4 text-magic-danger">신청 이력을 불러오지 못했습니다.</p>
					) : historyItems.length === 0 ? (
						<p className="py-4 text-center typo-regular-4 text-k-500">신청 이력이 없습니다.</p>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-left typo-regular-4 text-k-700">
								<thead className="border-b border-k-100 bg-bg-50">
									<tr>
										<th className="px-2 py-2 typo-sb-11 text-k-600">ID</th>
										<th className="px-2 py-2 typo-sb-11 text-k-600">상태</th>
										<th className="px-2 py-2 typo-sb-11 text-k-600">국가/대학/학기</th>
										<th className="px-2 py-2 typo-sb-11 text-k-600">신청일</th>
										<th className="px-2 py-2 typo-sb-11 text-k-600">거절 사유</th>
									</tr>
								</thead>
								<tbody>
									{historyItems.map((historyItem, index) => {
										const historyId = getApplicationId(historyItem);
										const historyStatus = getApplicationStatus(historyItem);

										return (
											<tr
												key={historyId ?? `${siteUserId}-${getCreatedAt(historyItem) ?? index}`}
												className="border-b border-k-100 last:border-b-0"
											>
												<td className="px-2 py-2">{toDisplayText(historyId)}</td>
												<td className="px-2 py-2">
													<MentorApplicationStatusBadge status={historyStatus} />
												</td>
												<td className="px-2 py-2">
													{toDisplayText(getCountry(historyItem))} / {toDisplayText(getUniversityName(historyItem))} /{" "}
													{toDisplayText(getTerm(historyItem))}
												</td>
												<td className="px-2 py-2">{formatDateTime(getCreatedAt(historyItem))}</td>
												<td className="px-2 py-2">{toDisplayText(getRejectedReason(historyItem))}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</TableCell>
		</TableRow>
	);
}

export function MentorApplicationsPageContent() {
	const queryClient = useQueryClient();
	const [statusFilter, setStatusFilter] = useState<MentorApplicationStatus>("PENDING");
	const [nickname, setNickname] = useState("");
	const [createdAt, setCreatedAt] = useState("");
	const [page, setPage] = useState(1);
	const [expandedSiteUserId, setExpandedSiteUserId] = useState<string | null>(null);
	const [rejectingApplicationId, setRejectingApplicationId] = useState<string | null>(null);
	const [rejectReason, setRejectReason] = useState("");
	const [mappingApplicationId, setMappingApplicationId] = useState<string | null>(null);
	const [mappingUniversityId, setMappingUniversityId] = useState("");

	const normalizedNickname = nickname.trim();

	const { data, isError, isFetching, isLoading } = useQuery({
		queryKey: ["mentorApplications", "list", statusFilter, normalizedNickname, createdAt, page],
		queryFn: () =>
			adminApi.getMentorApplicationList({
				page,
				size: PAGE_SIZE,
				mentorApplicationStatus: statusFilter,
				nickname: normalizedNickname || undefined,
				createdAt: createdAt || undefined,
			}),
		placeholderData: keepPreviousData,
	});

	const countQuery = useQuery({
		queryKey: ["mentorApplications", "count"],
		queryFn: adminApi.getCountMentorApplicationByStatus,
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		if (isError) {
			toast.error("멘토 승격 요청 목록을 불러오지 못했습니다.");
		}
	}, [isError]);

	useEffect(() => {
		if (countQuery.isError) {
			toast.error("멘토 승격 요청 상태별 개수를 불러오지 못했습니다.");
		}
	}, [countQuery.isError]);

	const applications = data?.content ?? [];
	const totalPages = Math.max(1, data?.totalPages ?? 1);
	const totalElements = data?.totalElements;

	const approveMutation = useMutation({
		mutationFn: (mentorApplicationId: string) => adminApi.postApproveMentorApplication(mentorApplicationId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["mentorApplications"] });
			toast.success("멘토 승격 요청을 승인했습니다.");
		},
		onError: () => {
			toast.error("멘토 승격 요청 승인에 실패했습니다.");
		},
	});

	const rejectMutation = useMutation({
		mutationFn: ({ mentorApplicationId, rejectedReason }: { mentorApplicationId: string; rejectedReason: string }) =>
			adminApi.postRejectMentorApplication(mentorApplicationId, rejectedReason),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["mentorApplications"] });
			setRejectingApplicationId(null);
			setRejectReason("");
			toast.success("멘토 승격 요청을 반려했습니다.");
		},
		onError: () => {
			toast.error("멘토 승격 요청 반려에 실패했습니다.");
		},
	});

	const mapUniversityMutation = useMutation({
		mutationFn: ({ mentorApplicationId, universityId }: { mentorApplicationId: string; universityId: number }) =>
			adminApi.assignMentorApplicationUniversity(mentorApplicationId, universityId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["mentorApplications"] });
			setMappingApplicationId(null);
			setMappingUniversityId("");
			toast.success("멘토 지원서 대학을 매핑했습니다.");
		},
		onError: () => {
			toast.error("멘토 지원서 대학 매핑에 실패했습니다.");
		},
	});

	const handlePageChange = (newPage: number) => {
		if (newPage < 1 || newPage > totalPages) return;
		setPage(newPage);
	};

	const handleFilterStatus = (nextStatus: MentorApplicationStatus) => {
		setStatusFilter(nextStatus);
		setPage(1);
	};

	const handleNicknameChange = (nextNickname: string) => {
		setNickname(nextNickname);
		setPage(1);
	};

	const handleCreatedAtChange = (nextCreatedAt: string) => {
		setCreatedAt(nextCreatedAt);
		setPage(1);
	};

	const handleApprove = async (application: MentorApplicationListItem) => {
		const applicationId = getApplicationId(application);
		if (!applicationId) {
			toast.error("신청 ID를 확인할 수 없습니다.");
			return;
		}

		await approveMutation.mutateAsync(applicationId);
	};

	const handleStartReject = (application: MentorApplicationListItem) => {
		const applicationId = getApplicationId(application);
		if (!applicationId) {
			toast.error("신청 ID를 확인할 수 없습니다.");
			return;
		}

		setRejectingApplicationId(applicationId);
		setRejectReason("");
	};

	const handleCancelReject = () => {
		setRejectingApplicationId(null);
		setRejectReason("");
	};

	const handleReject = async (mentorApplicationId: string) => {
		const normalizedReason = rejectReason.trim();
		if (!normalizedReason) {
			toast.error("거절 사유를 입력해주세요.");
			return;
		}

		await rejectMutation.mutateAsync({ mentorApplicationId, rejectedReason: normalizedReason });
	};

	const handleStartMapUniversity = (application: MentorApplicationListItem) => {
		const applicationId = getApplicationId(application);
		if (!applicationId) {
			toast.error("신청 ID를 확인할 수 없습니다.");
			return;
		}

		setMappingApplicationId(applicationId);
		setMappingUniversityId(getUniversityId(application) ?? "");
	};

	const handleCancelMapUniversity = () => {
		setMappingApplicationId(null);
		setMappingUniversityId("");
	};

	const handleMapUniversity = async (mentorApplicationId: string) => {
		const normalizedUniversityId = Number(mappingUniversityId.trim());
		if (!Number.isInteger(normalizedUniversityId) || normalizedUniversityId <= 0) {
			toast.error("대학 ID를 숫자로 입력해주세요.");
			return;
		}

		await mapUniversityMutation.mutateAsync({ mentorApplicationId, universityId: normalizedUniversityId });
	};

	return (
		<AdminLayout
			activeMenu="mentorApplications"
			title="멘토 승격 요청"
			description="멘토 전환 신청 내역을 확인하고 승인 또는 반려합니다."
		>
			<div className="mt-4 grid gap-3 sm:grid-cols-3">
				{STATUS_OPTIONS.map((option) => {
					const count = getCountByStatus(countQuery.data, option.value);
					const isActive = statusFilter === option.value;

					return (
						<button
							key={option.value}
							type="button"
							onClick={() => handleFilterStatus(option.value)}
							className={`rounded-xl border px-4 py-3 text-left transition-colors ${
								isActive ? "border-primary bg-primary-100" : "border-k-100 bg-k-0 hover:bg-k-50"
							}`}
						>
							<p className="typo-medium-4 text-k-500">{option.label}</p>
							<p className="mt-1 typo-bold-4 text-k-900">
								{countQuery.isLoading ? "..." : typeof count === "number" ? count.toLocaleString() : "-"}
							</p>
						</button>
					);
				})}
			</div>

			<div className="mt-4 grid gap-3 rounded-xl border border-k-100 bg-k-0 p-4 sm:grid-cols-[180px_minmax(180px,1fr)_180px_auto]">
				<label className="block">
					<span className="mb-1 block typo-sb-11 text-k-600">상태</span>
					<select
						value={statusFilter}
						onChange={(event) => handleFilterStatus(event.target.value as MentorApplicationStatus)}
						className="h-9 w-full rounded-md border border-k-200 bg-k-0 px-3 typo-regular-4 text-k-700 outline-none focus-visible:border-primary"
					>
						{STATUS_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</label>

				<label className="block">
					<span className="mb-1 block typo-sb-11 text-k-600">닉네임</span>
					<input
						type="search"
						value={nickname}
						onChange={(event) => handleNicknameChange(event.target.value)}
						placeholder="닉네임 검색"
						className="h-9 w-full rounded-md border border-k-200 bg-k-0 px-3 typo-regular-4 text-k-700 outline-none placeholder:text-k-400 focus-visible:border-primary"
					/>
				</label>

				<label className="block">
					<span className="mb-1 block typo-sb-11 text-k-600">신청일</span>
					<input
						type="date"
						value={createdAt}
						onChange={(event) => handleCreatedAtChange(event.target.value)}
						className="h-9 w-full rounded-md border border-k-200 bg-k-0 px-3 typo-regular-4 text-k-700 outline-none focus-visible:border-primary"
					/>
				</label>

				<div className="flex items-end">
					<Button
						type="button"
						variant="secondary"
						onClick={() => {
							setStatusFilter("PENDING");
							setNickname("");
							setCreatedAt("");
							setPage(1);
						}}
					>
						필터 초기화
					</Button>
				</div>
			</div>

			<div className="mt-4 flex items-center justify-between">
				<p className="typo-regular-4 text-k-500">
					총 {typeof totalElements === "number" ? totalElements.toLocaleString() : "-"}건
				</p>
				<p className="typo-regular-4 text-k-500">
					{page} / {totalPages} 페이지
				</p>
			</div>

			<div className="mt-3 rounded-lg border border-k-100 bg-k-0">
				{isFetching && !isLoading ? (
					<div className="border-b border-k-100 px-4 py-2 typo-regular-4 text-k-500">최신 데이터를 불러오는 중...</div>
				) : null}

				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>신청 ID</TableHead>
								<TableHead>사용자</TableHead>
								<TableHead>상태</TableHead>
								<TableHead>국가/대학/학기</TableHead>
								<TableHead>신청일</TableHead>
								<TableHead>거절 사유</TableHead>
								<TableHead>증빙 파일</TableHead>
								<TableHead>이력</TableHead>
								<TableHead>작업</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={9} className="text-center">
										<div className="flex items-center justify-center">
											<div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary" />
											<span className="ml-2 typo-regular-4 text-k-500">로딩중...</span>
										</div>
									</TableCell>
								</TableRow>
							) : isError ? (
								<TableRow>
									<TableCell colSpan={9} className="text-center typo-regular-4 text-magic-danger">
										멘토 승격 요청을 불러오지 못했습니다.
									</TableCell>
								</TableRow>
							) : applications.length === 0 ? (
								<TableRow>
									<TableCell colSpan={9} className="text-center typo-regular-4 text-k-500">
										멘토 승격 요청이 없습니다.
									</TableCell>
								</TableRow>
							) : (
								applications.map((application, index) => {
									const applicationId = getApplicationId(application);
									const siteUserId = getSiteUserId(application);
									const status = getApplicationStatus(application);
									const fileUrl = getVerificationFileUrl(application);
									const profileImageUrl = getProfileImageUrl(application);
									const universityId = getUniversityId(application);
									const isRejecting = Boolean(applicationId && rejectingApplicationId === applicationId);
									const isMappingUniversity = Boolean(applicationId && mappingApplicationId === applicationId);
									const isExpanded = Boolean(siteUserId && expandedSiteUserId === siteUserId);
									const isActionPending =
										approveMutation.isPending || rejectMutation.isPending || mapUniversityMutation.isPending;

									return (
										<Fragment key={applicationId ?? `${siteUserId ?? "unknown"}-${getCreatedAt(application) ?? index}`}>
											<TableRow className="hover:bg-bg-50">
												<TableCell>{toDisplayText(applicationId)}</TableCell>
												<TableCell>
													<div className="flex min-w-[140px] items-center">
														{profileImageUrl ? (
															<img
																src={profileImageUrl}
																alt="프로필"
																className="mr-2 h-8 w-8 rounded-full border border-k-100 object-cover"
															/>
														) : (
															<div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full border border-k-100 bg-k-50 typo-sb-11 text-k-500">
																{getNickname(application).slice(0, 1)}
															</div>
														)}
														<div>
															<p className="typo-medium-4 text-k-800">{getNickname(application)}</p>
															<p className="typo-regular-4 text-k-400">ID {toDisplayText(siteUserId)}</p>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<MentorApplicationStatusBadge status={status} />
												</TableCell>
												<TableCell>
													<div className="min-w-[180px]">
														<p className="typo-medium-4 text-k-800">{toDisplayText(getUniversityName(application))}</p>
														<p className="typo-regular-4 text-k-500">
															{toDisplayText(getCountry(application))} / {toDisplayText(getTerm(application))}
														</p>
														<p className="typo-regular-4 text-k-400">대학 ID {toDisplayText(universityId)}</p>
													</div>
												</TableCell>
												<TableCell>{formatDateTime(getCreatedAt(application))}</TableCell>
												<TableCell>{toDisplayText(getRejectedReason(application))}</TableCell>
												<TableCell>
													{fileUrl ? (
														<a
															href={fileUrl}
															target="_blank"
															rel="noopener noreferrer"
															className="typo-medium-4 text-primary hover:text-primary-700 hover:underline"
														>
															파일 보기
														</a>
													) : (
														<span className="typo-regular-4 text-k-400">-</span>
													)}
												</TableCell>
												<TableCell>
													<Button
														type="button"
														variant="secondary"
														size="sm"
														disabled={!siteUserId}
														onClick={() => {
															if (!siteUserId) return;
															setExpandedSiteUserId((prev) => (prev === siteUserId ? null : siteUserId));
														}}
													>
														{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
														이력
													</Button>
												</TableCell>
												<TableCell>
													{status === "PENDING" && applicationId ? (
														isMappingUniversity ? (
															<div className="flex min-w-[240px] items-center gap-2">
																<input
																	type="number"
																	value={mappingUniversityId}
																	onChange={(event) => setMappingUniversityId(event.target.value)}
																	placeholder="대학 ID"
																	className="h-8 w-[120px] rounded-md border border-k-200 bg-k-0 px-2 typo-regular-4 text-k-700 outline-none placeholder:text-k-400 focus-visible:border-primary"
																/>
																<Button
																	type="button"
																	size="sm"
																	disabled={mapUniversityMutation.isPending}
																	onClick={() => handleMapUniversity(applicationId)}
																>
																	확인
																</Button>
																<Button type="button" size="sm" variant="secondary" onClick={handleCancelMapUniversity}>
																	취소
																</Button>
															</div>
														) : isRejecting ? (
															<div className="flex min-w-[280px] items-center gap-2">
																<input
																	type="text"
																	value={rejectReason}
																	onChange={(event) => setRejectReason(event.target.value)}
																	placeholder="거절 사유"
																	className="h-8 flex-1 rounded-md border border-k-200 bg-k-0 px-2 typo-regular-4 text-k-700 outline-none placeholder:text-k-400 focus-visible:border-primary"
																/>
																<Button
																	type="button"
																	size="sm"
																	variant="destructive"
																	disabled={rejectMutation.isPending}
																	onClick={() => handleReject(applicationId)}
																>
																	확인
																</Button>
																<Button type="button" size="sm" variant="secondary" onClick={handleCancelReject}>
																	취소
																</Button>
															</div>
														) : (
															<div className="flex items-center gap-2">
																<Button
																	type="button"
																	size="sm"
																	variant="secondary"
																	disabled={isActionPending}
																	onClick={() => handleStartMapUniversity(application)}
																>
																	대학 매핑
																</Button>
																<Button
																	type="button"
																	size="sm"
																	disabled={isActionPending}
																	onClick={() => handleApprove(application)}
																>
																	승인
																</Button>
																<Button
																	type="button"
																	size="sm"
																	variant="destructive"
																	disabled={isActionPending}
																	onClick={() => handleStartReject(application)}
																>
																	반려
																</Button>
															</div>
														)
													) : (
														<span className="typo-regular-4 text-k-400">-</span>
													)}
												</TableCell>
											</TableRow>

											{isExpanded && siteUserId ? (
												<MentorApplicationHistoryRow colSpan={9} siteUserId={siteUserId} />
											) : null}
										</Fragment>
									);
								})
							)}
						</TableBody>
					</Table>
				</div>

				<div className="mt-4 flex items-center justify-center gap-2 border-t border-k-100 p-4">
					<Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} variant="secondary">
						이전
					</Button>
					{Array.from({ length: totalPages }, (_, idx) => (
						<Button
							// biome-ignore lint/suspicious/noArrayIndexKey: pagination buttons are static.
							key={idx + 1}
							onClick={() => handlePageChange(idx + 1)}
							variant={page === idx + 1 ? "default" : "secondary"}
						>
							{idx + 1}
						</Button>
					))}
					<Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} variant="secondary">
						다음
					</Button>
				</div>
			</div>
		</AdminLayout>
	);
}
