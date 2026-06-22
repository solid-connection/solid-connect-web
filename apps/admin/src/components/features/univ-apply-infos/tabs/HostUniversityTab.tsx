"use client";

import { keepPreviousData, useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
	adminApi,
	type HostUniversityDetailResponse,
	type HostUniversityPayload,
	type HostUniversityResponse,
} from "@/lib/api/admin";

type ModalState = { open: false } | { open: true; mode: "create" } | { open: true; mode: "edit"; id: number };

const REQUIRED_FIELDS = [
	"koreanName",
	"englishName",
	"formatName",
	"logoImageUrl",
	"backgroundImageUrl",
	"countryCode",
	"regionCode",
] as const;
const OPTIONAL_FIELDS = ["homepageUrl", "englishCourseUrl", "accommodationUrl"] as const;

const FIELD_LABELS: Record<keyof HostUniversityPayload, string> = {
	koreanName: "한글명",
	englishName: "영문명",
	formatName: "표시명",
	logoImageUrl: "로고 이미지 URL",
	backgroundImageUrl: "배경 이미지 URL",
	countryCode: "국가코드",
	regionCode: "권역코드",
	homepageUrl: "홈페이지 URL",
	englishCourseUrl: "영어강좌 URL",
	accommodationUrl: "숙소 URL",
	detailsForLocal: "상세 설명",
};

const EMPTY_FORM: HostUniversityPayload = {
	koreanName: "",
	englishName: "",
	formatName: "",
	logoImageUrl: "",
	backgroundImageUrl: "",
	countryCode: "",
	regionCode: "",
	homepageUrl: "",
	englishCourseUrl: "",
	accommodationUrl: "",
	detailsForLocal: "",
};

function detailToForm(detail: HostUniversityDetailResponse): HostUniversityPayload {
	return {
		koreanName: detail.koreanName,
		englishName: detail.englishName,
		formatName: detail.formatName,
		logoImageUrl: detail.logoImageUrl,
		backgroundImageUrl: detail.backgroundImageUrl,
		countryCode: detail.countryCode,
		regionCode: detail.regionCode,
		homepageUrl: detail.homepageUrl ?? "",
		englishCourseUrl: detail.englishCourseUrl ?? "",
		accommodationUrl: detail.accommodationUrl ?? "",
		detailsForLocal: detail.detailsForLocal ?? "",
	};
}

function toPayload(form: HostUniversityPayload): HostUniversityPayload {
	return {
		...form,
		homepageUrl: form.homepageUrl || undefined,
		englishCourseUrl: form.englishCourseUrl || undefined,
		accommodationUrl: form.accommodationUrl || undefined,
		detailsForLocal: form.detailsForLocal || undefined,
	};
}

export function HostUniversityTab() {
	const queryClient = useQueryClient();
	const uid = useId();

	const [keyword, setKeyword] = useState("");
	const [countryCode, setCountryCode] = useState("");
	const [regionCode, setRegionCode] = useState("");
	const [searchParams, setSearchParams] = useState({ keyword: "", countryCode: "", regionCode: "", page: 0 });

	const [modal, setModal] = useState<ModalState>({ open: false });
	const [form, setForm] = useState<HostUniversityPayload>(EMPTY_FORM);

	const query = useQuery({
		queryKey: ["admin", "host-universities", searchParams],
		queryFn: () => adminApi.getHostUniversities({ ...searchParams, size: 20 }),
		placeholderData: keepPreviousData,
	});

	const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "host-universities"] });

	const createMutation = useMutation({
		mutationFn: (data: HostUniversityPayload) => adminApi.createHostUniversity(data),
		onSuccess: async () => {
			await invalidate();
			setModal({ open: false });
			toast.success("호스트 대학교를 생성했습니다.");
		},
		onError: (e: unknown) => {
			const msg = e instanceof Error ? e.message : "생성에 실패했습니다.";
			toast.error(msg);
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: HostUniversityPayload }) => adminApi.updateHostUniversity(id, data),
		onSuccess: async () => {
			await invalidate();
			setModal({ open: false });
			toast.success("호스트 대학교를 수정했습니다.");
		},
		onError: (e: unknown) => {
			const msg = e instanceof Error ? e.message : "수정에 실패했습니다.";
			toast.error(msg);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => adminApi.deleteHostUniversity(id),
		onSuccess: async () => {
			await invalidate();
			toast.success("호스트 대학교를 삭제했습니다.");
		},
		onError: (e: unknown) => {
			const msg = e instanceof Error ? e.message : "삭제에 실패했습니다.";
			toast.error(msg);
		},
	});

	const handleSearch = (e: FormEvent) => {
		e.preventDefault();
		setSearchParams({ keyword, countryCode, regionCode, page: 0 });
	};

	const handleOpenCreate = () => {
		setForm(EMPTY_FORM);
		setModal({ open: true, mode: "create" });
	};

	const handleOpenEdit = (univ: HostUniversityResponse) => {
		const cached = detailMap.get(univ.id);
		if (cached) {
			setForm(detailToForm(cached));
			setModal({ open: true, mode: "edit", id: univ.id });
			return;
		}
		adminApi
			.getHostUniversity(univ.id)
			.then((detail) => {
				setForm(detailToForm(detail));
				setModal({ open: true, mode: "edit", id: univ.id });
			})
			.catch(() => toast.error("대학교 정보를 불러오지 못했습니다."));
	};

	const handleDelete = (id: number, name: string) => {
		if (!window.confirm(`"${name}"을 삭제할까요?`)) return;
		deleteMutation.mutate(id);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const payload = toPayload(form);
		if (modal.open && modal.mode === "edit") {
			updateMutation.mutate({ id: modal.id, data: payload });
		} else {
			createMutation.mutate(payload);
		}
	};

	const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
	const universities = query.data?.content ?? [];
	const totalPages = query.data?.totalPages ?? 0;
	const currentPage = searchParams.page;

	const detailQueries = useQueries({
		queries: universities.map((u) => ({
			queryKey: ["admin", "host-universities", u.id] as const,
			queryFn: () => adminApi.getHostUniversity(u.id),
		})),
	});

	const detailMap = new Map(universities.map((u, i) => [u.id, detailQueries[i]?.data ?? null]));

	return (
		<div className="space-y-4">
			<section className="rounded-xl border border-k-100 bg-k-0 p-4">
				<div className="flex items-center justify-between gap-3">
					<h2 className="typo-sb-9 text-k-900">호스트 대학교</h2>
					<Button type="button" onClick={handleOpenCreate}>
						호스트 대학교 생성
					</Button>
				</div>
				<form onSubmit={handleSearch} className="mt-3 flex flex-wrap gap-2">
					<Input
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
						placeholder="대학명 검색"
						className="w-48"
					/>
					<Input
						value={countryCode}
						onChange={(e) => setCountryCode(e.target.value)}
						placeholder="국가코드 (예: JP)"
						className="w-36"
					/>
					<Input
						value={regionCode}
						onChange={(e) => setRegionCode(e.target.value)}
						placeholder="권역코드 (예: ASIA)"
						className="w-40"
					/>
					<Button type="submit" variant="secondary">
						검색
					</Button>
				</form>
			</section>

			<section className="rounded-xl border border-k-100 bg-k-0 p-4">
				<p className="mb-3 typo-regular-4 text-k-500">총 {(query.data?.totalElements ?? 0).toLocaleString()}건</p>
				<div className="overflow-x-auto rounded-lg border border-k-100">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="whitespace-nowrap">ID</TableHead>
								<TableHead className="whitespace-nowrap">한글명</TableHead>
								<TableHead className="whitespace-nowrap">영문명</TableHead>
								<TableHead className="whitespace-nowrap">표시명</TableHead>
								<TableHead className="whitespace-nowrap">국가</TableHead>
								<TableHead className="whitespace-nowrap">권역</TableHead>
								<TableHead className="whitespace-nowrap">로고</TableHead>
								<TableHead className="whitespace-nowrap">배경</TableHead>
								<TableHead className="whitespace-nowrap">홈페이지</TableHead>
								<TableHead className="whitespace-nowrap">영어강좌</TableHead>
								<TableHead className="whitespace-nowrap">숙소</TableHead>
								<TableHead className="whitespace-nowrap">현지 안내</TableHead>
								<TableHead className="sticky right-0 whitespace-nowrap border-l border-k-100 bg-k-50">작업</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{query.isLoading ? (
								<TableRow>
									<TableCell colSpan={13} className="text-center typo-regular-4 text-k-500">
										불러오는 중...
									</TableCell>
								</TableRow>
							) : query.isError ? (
								<TableRow>
									<TableCell colSpan={13} className="text-center typo-regular-4 text-magic-danger">
										불러오지 못했습니다.
									</TableCell>
								</TableRow>
							) : universities.length === 0 ? (
								<TableRow>
									<TableCell colSpan={13} className="text-center typo-regular-4 text-k-500">
										결과가 없습니다.
									</TableCell>
								</TableRow>
							) : (
								universities.map((u, idx) => {
									const detail = detailMap.get(u.id);
									const detailLoading = detailQueries[idx]?.isLoading;
									const urlCell = (url: string | null | undefined) =>
										url ? (
											<a
												href={url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-primary underline typo-regular-4"
											>
												링크
											</a>
										) : (
											"—"
										);
									return (
										<TableRow key={u.id}>
											<TableCell>{u.id}</TableCell>
											<TableCell className="whitespace-nowrap">{u.koreanName}</TableCell>
											<TableCell className="whitespace-nowrap">{u.englishName}</TableCell>
											<TableCell className="whitespace-nowrap">{u.formatName}</TableCell>
											<TableCell className="whitespace-nowrap">
												{u.countryKoreanName} ({u.countryCode})
											</TableCell>
											<TableCell className="whitespace-nowrap">
												{u.regionKoreanName} ({u.regionCode})
											</TableCell>
											<TableCell>{urlCell(u.logoImageUrl)}</TableCell>
											<TableCell>{detailLoading ? "…" : urlCell(detail?.backgroundImageUrl)}</TableCell>
											<TableCell>{detailLoading ? "…" : urlCell(detail?.homepageUrl)}</TableCell>
											<TableCell>{detailLoading ? "…" : urlCell(detail?.englishCourseUrl)}</TableCell>
											<TableCell>{detailLoading ? "…" : urlCell(detail?.accommodationUrl)}</TableCell>
											<TableCell className="max-w-48 truncate" title={detail?.detailsForLocal ?? ""}>
												{detailLoading ? "…" : (detail?.detailsForLocal ?? "—")}
											</TableCell>
											<TableCell className="sticky right-0 border-l border-k-100 bg-k-0">
												<div className="flex gap-2">
													<Button size="sm" variant="secondary" onClick={() => handleOpenEdit(u)} disabled={isMutating}>
														수정
													</Button>
													<Button
														size="sm"
														variant="destructive"
														onClick={() => handleDelete(u.id, u.koreanName)}
														disabled={isMutating}
													>
														삭제
													</Button>
												</div>
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>
				</div>

				{totalPages > 1 && (
					<div className="mt-3 flex items-center justify-center gap-2">
						<Button
							type="button"
							variant="secondary"
							size="sm"
							disabled={currentPage === 0}
							onClick={() => setSearchParams((p) => ({ ...p, page: p.page - 1 }))}
						>
							이전
						</Button>
						<span className="typo-regular-4 text-k-500">
							{currentPage + 1} / {totalPages}
						</span>
						<Button
							type="button"
							variant="secondary"
							size="sm"
							disabled={currentPage >= totalPages - 1}
							onClick={() => setSearchParams((p) => ({ ...p, page: p.page + 1 }))}
						>
							다음
						</Button>
					</div>
				)}
			</section>

			{modal.open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<button
						type="button"
						aria-label="모달 닫기"
						className="absolute inset-0 bg-black/50"
						onClick={() => setModal({ open: false })}
					/>
					<div
						role="dialog"
						aria-modal="true"
						className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-xl bg-k-0 shadow-xl"
					>
						<div className="flex items-center justify-between border-b border-k-100 px-5 py-4">
							<p className="typo-sb-9 text-k-900">
								{modal.mode === "create" ? "호스트 대학교 생성" : "호스트 대학교 수정"}
							</p>
							<button
								type="button"
								onClick={() => setModal({ open: false })}
								className="typo-regular-4 text-k-400 hover:text-k-700"
							>
								✕
							</button>
						</div>
						<form onSubmit={handleSubmit} className="space-y-3 p-5">
							{REQUIRED_FIELDS.map((field) => (
								<div key={field} className="space-y-1">
									<label htmlFor={`field-${field}`} className="typo-sb-11 text-k-700">
										{FIELD_LABELS[field]} *
									</label>
									<Input
										id={`field-${field}`}
										value={form[field]}
										onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
										required
									/>
								</div>
							))}
							{OPTIONAL_FIELDS.map((field) => (
								<div key={field} className="space-y-1">
									<label htmlFor={`field-${field}`} className="typo-sb-11 text-k-700">
										{FIELD_LABELS[field]}
									</label>
									<Input
										id={`field-${field}`}
										value={form[field] ?? ""}
										onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
									/>
								</div>
							))}
							<div className="space-y-1">
								<label htmlFor={`${uid}-detailsForLocal`} className="typo-sb-11 text-k-700">
									{FIELD_LABELS.detailsForLocal}
								</label>
								<Textarea
									id={`${uid}-detailsForLocal`}
									value={form.detailsForLocal ?? ""}
									onChange={(e) => setForm((prev) => ({ ...prev, detailsForLocal: e.target.value }))}
									className="h-24"
								/>
							</div>
							<div className="flex justify-end gap-2 pt-2">
								<Button type="button" variant="secondary" onClick={() => setModal({ open: false })}>
									취소
								</Button>
								<Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
									{modal.mode === "create" ? "생성" : "저장"}
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
