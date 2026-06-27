"use client";

import { keepPreviousData, useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Upload } from "lucide-react";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
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
import { cn } from "@/lib/utils";
import { normalizeImageUrlToUploadCdn } from "@/lib/utils/cdnUrl";

type ModalState = { open: false } | { open: true; mode: "create" } | { open: true; mode: "edit"; id: number };

interface HostUniversityFormState extends Omit<HostUniversityPayload, "formatName"> {
	logoImageUrl: string;
	backgroundImageUrl: string;
}

function toFormatName(englishName: string): string {
	return englishName
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_+|_+$/g, "");
}

const REQUIRED_FIELDS = ["koreanName", "englishName", "countryCode", "regionCode"] as const;
const OPTIONAL_FIELDS = ["homepageUrl", "englishCourseUrl", "accommodationUrl"] as const;

const FIELD_LABELS: Record<string, string> = {
	koreanName: "한글명",
	englishName: "영문명",
	countryCode: "국가코드",
	regionCode: "권역코드",
	homepageUrl: "홈페이지 URL",
	englishCourseUrl: "영어강좌 URL",
	accommodationUrl: "숙소 URL",
	detailsForLocal: "상세 설명",
};

const EMPTY_FORM: HostUniversityFormState = {
	koreanName: "",
	englishName: "",
	logoImageUrl: "",
	backgroundImageUrl: "",
	countryCode: "",
	regionCode: "",
	homepageUrl: "",
	englishCourseUrl: "",
	accommodationUrl: "",
	detailsForLocal: "",
};

function detailToForm(detail: HostUniversityDetailResponse): HostUniversityFormState {
	return {
		koreanName: detail.koreanName,
		englishName: detail.englishName,
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

function toPayload(form: HostUniversityFormState): HostUniversityPayload {
	return {
		koreanName: form.koreanName,
		englishName: form.englishName,
		formatName: toFormatName(form.englishName),
		countryCode: form.countryCode,
		regionCode: form.regionCode,
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
	const [form, setForm] = useState<HostUniversityFormState>(EMPTY_FORM);
	const [logoFile, setLogoFile] = useState<File | null>(null);
	const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
	const [logoPreviewUrl, setLogoPreviewUrl] = useState("");
	const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState("");
	const pendingEditIdRef = useRef<number | null>(null);

	useEffect(() => {
		if (!logoFile) {
			setLogoPreviewUrl("");
			return;
		}
		const url = URL.createObjectURL(logoFile);
		setLogoPreviewUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [logoFile]);

	useEffect(() => {
		if (!backgroundFile) {
			setBackgroundPreviewUrl("");
			return;
		}
		const url = URL.createObjectURL(backgroundFile);
		setBackgroundPreviewUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [backgroundFile]);

	const closeModal = () => {
		pendingEditIdRef.current = null;
		setLogoFile(null);
		setBackgroundFile(null);
		setModal({ open: false });
	};

	const query = useQuery({
		queryKey: ["admin", "host-universities", searchParams],
		queryFn: () => adminApi.getHostUniversities({ ...searchParams, size: 20 }),
		placeholderData: keepPreviousData,
	});

	const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "host-universities"] });

	const createMutation = useMutation({
		mutationFn: ({ data, logo, background }: { data: HostUniversityPayload; logo: File; background: File }) =>
			adminApi.createHostUniversity(data, logo, background),
		onSuccess: async () => {
			await invalidate();
			closeModal();
			toast.success("호스트 대학교를 생성했습니다.");
		},
		onError: (e: unknown) => {
			const msg = e instanceof Error ? e.message : "생성에 실패했습니다.";
			toast.error(msg);
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({
			id,
			data,
			logo,
			background,
		}: {
			id: number;
			data: HostUniversityPayload;
			logo?: File | null;
			background?: File | null;
		}) => adminApi.updateHostUniversity(id, data, logo, background),
		onSuccess: async () => {
			await invalidate();
			closeModal();
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
		pendingEditIdRef.current = null;
		setForm(EMPTY_FORM);
		setLogoFile(null);
		setBackgroundFile(null);
		setModal({ open: true, mode: "create" });
	};

	const handleOpenEdit = (univ: HostUniversityResponse) => {
		pendingEditIdRef.current = univ.id;
		setLogoFile(null);
		setBackgroundFile(null);
		const cached = detailMap.get(univ.id);
		if (cached) {
			setForm(detailToForm(cached));
			setModal({ open: true, mode: "edit", id: univ.id });
			return;
		}
		adminApi
			.getHostUniversity(univ.id)
			.then((detail) => {
				if (pendingEditIdRef.current !== univ.id) return;
				setForm(detailToForm(detail));
				setModal({ open: true, mode: "edit", id: univ.id });
			})
			.catch(() => {
				if (pendingEditIdRef.current === univ.id) toast.error("대학교 정보를 불러오지 못했습니다.");
			});
	};

	const handleDelete = (id: number, name: string) => {
		if (!window.confirm(`"${name}"을 삭제할까요?`)) return;
		deleteMutation.mutate(id);
	};

	const handleLogoChange = (file: File | undefined) => {
		if (!file) return;
		setLogoFile(file);
	};

	const handleBackgroundChange = (file: File | undefined) => {
		if (!file) return;
		setBackgroundFile(file);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const payload = toPayload(form);
		if (modal.open && modal.mode === "edit") {
			updateMutation.mutate({ id: modal.id, data: payload, logo: logoFile, background: backgroundFile });
		} else {
			if (!logoFile || !backgroundFile) {
				toast.error("로고 및 배경 이미지를 모두 선택해 주세요.");
				return;
			}
			createMutation.mutate({ data: payload, logo: logoFile, background: backgroundFile });
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
					<button type="button" aria-label="모달 닫기" className="absolute inset-0 bg-black/50" onClick={closeModal} />
					<div
						role="dialog"
						aria-modal="true"
						className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-xl bg-k-0 shadow-xl"
					>
						<div className="flex items-center justify-between border-b border-k-100 px-5 py-4">
							<p className="typo-sb-9 text-k-900">
								{modal.mode === "create" ? "호스트 대학교 생성" : "호스트 대학교 수정"}
							</p>
							<button type="button" onClick={closeModal} className="typo-regular-4 text-k-400 hover:text-k-700">
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

							<div className="space-y-1">
								<p className="typo-sb-11 text-k-700">로고 이미지{modal.mode === "create" ? " *" : ""}</p>
								<div className="flex items-center gap-3 rounded-lg border border-k-100 bg-k-50 p-3">
									{logoPreviewUrl || form.logoImageUrl ? (
										<img
											src={logoPreviewUrl || normalizeImageUrlToUploadCdn(form.logoImageUrl)}
											alt="로고 미리보기"
											className="h-14 w-14 shrink-0 rounded-md border border-k-100 bg-white object-contain p-1"
										/>
									) : (
										<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-dashed border-k-200 bg-white">
											<ImageIcon className="h-5 w-5 text-k-300" />
										</div>
									)}
									<label
										className={cn(
											"flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 typo-regular-4 transition-colors",
											"border-k-200 text-k-600 hover:border-primary hover:bg-primary/5 hover:text-primary",
										)}
									>
										<Upload className="h-4 w-4" />
										{logoFile ? logoFile.name : "파일 선택"}
										<input
											type="file"
											accept="image/*"
											aria-label="로고 이미지 파일"
											className="sr-only"
											onChange={(e) => {
												handleLogoChange(e.target.files?.[0]);
												e.target.value = "";
											}}
										/>
									</label>
								</div>
							</div>

							<div className="space-y-1">
								<p className="typo-sb-11 text-k-700">배경 이미지{modal.mode === "create" ? " *" : ""}</p>
								<div className="flex items-center gap-3 rounded-lg border border-k-100 bg-k-50 p-3">
									{backgroundPreviewUrl || form.backgroundImageUrl ? (
										<img
											src={backgroundPreviewUrl || normalizeImageUrlToUploadCdn(form.backgroundImageUrl)}
											alt="배경 미리보기"
											className="h-14 w-28 shrink-0 rounded-md border border-k-100 bg-white object-cover"
										/>
									) : (
										<div className="flex h-14 w-28 shrink-0 items-center justify-center rounded-md border border-dashed border-k-200 bg-white">
											<ImageIcon className="h-5 w-5 text-k-300" />
										</div>
									)}
									<label
										className={cn(
											"flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 typo-regular-4 transition-colors",
											"border-k-200 text-k-600 hover:border-primary hover:bg-primary/5 hover:text-primary",
										)}
									>
										<Upload className="h-4 w-4" />
										{backgroundFile ? backgroundFile.name : "파일 선택"}
										<input
											type="file"
											accept="image/*"
											aria-label="배경 이미지 파일"
											className="sr-only"
											onChange={(e) => {
												handleBackgroundChange(e.target.files?.[0]);
												e.target.value = "";
											}}
										/>
									</label>
								</div>
							</div>

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
								<Button type="button" variant="secondary" onClick={closeModal}>
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
