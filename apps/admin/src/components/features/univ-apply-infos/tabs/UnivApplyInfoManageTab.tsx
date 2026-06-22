"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
	adminApi,
	type UnivApplyInfoCreatePayload,
	type UnivApplyInfoSearchResult,
	type UnivApplyInfoUpdatePayload,
} from "@/lib/api/admin";

const SEMESTER_OPTIONS: { value: string; label: string }[] = [
	{ value: "ONE_SEMESTER", label: "1개학기" },
	{ value: "TWO_SEMESTER", label: "2개학기" },
	{ value: "FOUR_SEMESTER", label: "4개학기" },
	{ value: "ONE_OR_TWO_SEMESTER", label: "1개 또는 2개 학기" },
	{ value: "ONE_YEAR", label: "1년만 가능" },
	{ value: "IRRELEVANT", label: "무관" },
	{ value: "NO_DATA", label: "데이터 없음" },
];

const EDIT_TEXT_FIELDS = [
	{ key: "semesterRequirement", label: "학기 요건" },
	{ key: "detailsForLanguage", label: "언어 상세" },
	{ key: "gpaRequirement", label: "학점 요건" },
	{ key: "gpaRequirementCriteria", label: "학점 기준" },
	{ key: "detailsForAccommodation", label: "숙소 상세" },
] as const;

type EditModal = { open: false } | { open: true; id: number; name: string };
type CreateModal = { open: boolean };

function parseExtraInfo(text: string): Record<string, string> | undefined {
	if (!text.trim()) return undefined;
	try {
		const parsed: unknown = JSON.parse(text);
		if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
			return parsed as Record<string, string>;
		}
		return undefined;
	} catch {
		return undefined;
	}
}

export function UnivApplyInfoManageTab() {
	const queryClient = useQueryClient();
	const uid = useId();

	const [searchText, setSearchText] = useState("");
	const [searchHomeUniversityId, setSearchHomeUniversityId] = useState("");
	const [searchTermId, setSearchTermId] = useState("");
	const [committedSearch, setCommittedSearch] = useState<{
		value?: string;
		homeUniversityId?: number;
		termId?: number;
	} | null>(null);

	const [editModal, setEditModal] = useState<EditModal>({ open: false });
	const [editForm, setEditForm] = useState<UnivApplyInfoUpdatePayload>({});
	const [editExtraInfoText, setEditExtraInfoText] = useState("");

	const [createModal, setCreateModal] = useState<CreateModal>({ open: false });
	const [createForm, setCreateForm] = useState<Partial<UnivApplyInfoCreatePayload>>({});
	const [createExtraInfoText, setCreateExtraInfoText] = useState("");
	const [hostKeyword, setHostKeyword] = useState("");
	const [hostSearchQuery, setHostSearchQuery] = useState("");

	const searchResultQuery = useQuery({
		queryKey: ["univ-apply-infos", "search", committedSearch],
		queryFn: () => adminApi.searchUnivApplyInfos(committedSearch ?? {}),
		enabled: committedSearch !== null,
	});

	const homeUniversitiesQuery = useQuery({
		queryKey: ["admin", "home-universities"],
		queryFn: adminApi.getHomeUniversities,
	});

	const termsQuery = useQuery({
		queryKey: ["admin", "terms"],
		queryFn: adminApi.getTerms,
	});

	const hostSearchQuery2 = useQuery({
		queryKey: ["admin", "host-universities", "modal-search", hostSearchQuery],
		queryFn: () => adminApi.getHostUniversities({ keyword: hostSearchQuery, size: 10 }),
		enabled: hostSearchQuery.length > 0,
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: UnivApplyInfoUpdatePayload }) =>
			adminApi.updateUnivApplyInfo(id, data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["univ-apply-infos", "search"],
			});
			setEditModal({ open: false });
			toast.success("지원 대학 정보를 수정했습니다.");
		},
		onError: (e: unknown) => {
			const msg = e instanceof Error ? e.message : "수정에 실패했습니다.";
			toast.error(msg);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => adminApi.deleteUnivApplyInfo(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["univ-apply-infos", "search"],
			});
			toast.success("지원 대학을 삭제했습니다.");
		},
		onError: (e: unknown) => {
			const msg = e instanceof Error ? e.message : "삭제에 실패했습니다.";
			toast.error(msg);
		},
	});

	const createMutation = useMutation({
		mutationFn: (data: UnivApplyInfoCreatePayload) => adminApi.createUnivApplyInfo(data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["univ-apply-infos", "search"],
			});
			setCreateModal({ open: false });
			toast.success("지원 대학을 추가했습니다.");
		},
		onError: (e: unknown) => {
			const msg = e instanceof Error ? e.message : "추가에 실패했습니다.";
			toast.error(msg);
		},
	});

	const handleSearch = (e: FormEvent) => {
		e.preventDefault();
		setCommittedSearch({
			value: searchText || undefined,
			homeUniversityId: searchHomeUniversityId ? Number(searchHomeUniversityId) : undefined,
			termId: searchTermId ? Number(searchTermId) : undefined,
		});
	};

	const handleOpenEdit = (item: UnivApplyInfoSearchResult) => {
		setEditForm({ studentCapacity: item.studentCapacity });
		setEditExtraInfoText("");
		setEditModal({ open: true, id: item.id, name: item.koreanName });
	};

	const handleDelete = (id: number, name: string) => {
		if (!window.confirm(`"${name}"을 삭제할까요?`)) return;
		deleteMutation.mutate(id);
	};

	const handleEditSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!editModal.open) return;

		const extraInfo = parseExtraInfo(editExtraInfoText);
		if (editExtraInfoText.trim() && extraInfo === undefined) {
			toast.error("추가 정보가 올바른 JSON 형식이 아닙니다.");
			return;
		}

		updateMutation.mutate({
			id: editModal.id,
			data: { ...editForm, extraInfo },
		});
	};

	const handleCreateSubmit = (e: FormEvent) => {
		e.preventDefault();
		const { termId, homeUniversityId, hostUniversityId } = createForm;
		if (!termId || !homeUniversityId || !hostUniversityId) {
			toast.error("학기, 협정 대학, 호스트 대학교는 필수입니다.");
			return;
		}

		const extraInfo = parseExtraInfo(createExtraInfoText);
		if (createExtraInfoText.trim() && extraInfo === undefined) {
			toast.error("추가 정보가 올바른 JSON 형식이 아닙니다.");
			return;
		}

		createMutation.mutate({
			termId,
			homeUniversityId,
			hostUniversityId,
			...createForm,
			extraInfo,
		} as UnivApplyInfoCreatePayload);
	};

	const handleOpenCreate = () => {
		setCreateForm({});
		setCreateExtraInfoText("");
		setHostKeyword("");
		setHostSearchQuery("");
		setCreateModal({ open: true });
	};

	const results = searchResultQuery.data?.univApplyInfoPreviews ?? [];
	const isMutating = deleteMutation.isPending || updateMutation.isPending || createMutation.isPending;

	return (
		<div className="space-y-4">
			<section className="rounded-xl border border-k-100 bg-k-0 p-4">
				<div className="flex items-center justify-between gap-3">
					<h2 className="typo-sb-9 text-k-900">지원 대학 관리</h2>
					<Button type="button" onClick={handleOpenCreate}>
						단건 추가
					</Button>
				</div>
				<form onSubmit={handleSearch} className="mt-3 flex flex-wrap gap-2">
					<Input
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						placeholder="대학명"
						className="w-48"
					/>
					<select
						value={searchHomeUniversityId}
						onChange={(e) => setSearchHomeUniversityId(e.target.value)}
						className="h-9 rounded-md border border-k-200 bg-k-0 px-3 typo-regular-4 text-k-700 outline-none focus-visible:border-primary"
					>
						<option value="">국내 대학 전체</option>
						{(homeUniversitiesQuery.data ?? []).map((u) => (
							<option key={u.id} value={u.id}>
								{u.name}
							</option>
						))}
					</select>
					<select
						value={searchTermId}
						onChange={(e) => setSearchTermId(e.target.value)}
						className="h-9 rounded-md border border-k-200 bg-k-0 px-3 typo-regular-4 text-k-700 outline-none focus-visible:border-primary"
					>
						<option value="">학기 전체</option>
						{(termsQuery.data ?? []).map((t) => (
							<option key={t.id} value={t.id}>
								{t.label}
							</option>
						))}
					</select>
					<Button type="submit" variant="secondary">
						검색
					</Button>
				</form>
			</section>

			{committedSearch !== null && (
				<section className="rounded-xl border border-k-100 bg-k-0 p-4">
					<div className="overflow-x-auto rounded-lg border border-k-100">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>학기</TableHead>
									<TableHead>대학명</TableHead>
									<TableHead>협정대학</TableHead>
									<TableHead>국가</TableHead>
									<TableHead>정원</TableHead>
									<TableHead>작업</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{searchResultQuery.isLoading ? (
									<TableRow>
										<TableCell colSpan={7} className="text-center typo-regular-4 text-k-500">
											검색 중...
										</TableCell>
									</TableRow>
								) : searchResultQuery.isError ? (
									<TableRow>
										<TableCell colSpan={7} className="text-center typo-regular-4 text-magic-danger">
											불러오지 못했습니다.
										</TableCell>
									</TableRow>
								) : results.length === 0 ? (
									<TableRow>
										<TableCell colSpan={7} className="text-center typo-regular-4 text-k-500">
											결과가 없습니다.
										</TableCell>
									</TableRow>
								) : (
									results.map((item) => (
										<TableRow key={item.id}>
											<TableCell>{item.id}</TableCell>
											<TableCell>{item.term}</TableCell>
											<TableCell>{item.koreanName}</TableCell>
											<TableCell>{item.homeUniversityName ?? "—"}</TableCell>
											<TableCell>{item.country}</TableCell>
											<TableCell>{item.studentCapacity ?? "—"}</TableCell>
											<TableCell>
												<div className="flex gap-2">
													<Button
														size="sm"
														variant="secondary"
														onClick={() => handleOpenEdit(item)}
														disabled={isMutating}
													>
														수정
													</Button>
													<Button
														size="sm"
														variant="destructive"
														onClick={() => handleDelete(item.id, item.koreanName)}
														disabled={isMutating}
													>
														삭제
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</section>
			)}

			{/* 수정 모달 */}
			{editModal.open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<button
						type="button"
						aria-label="모달 닫기"
						className="absolute inset-0 bg-black/50"
						onClick={() => setEditModal({ open: false })}
					/>
					<div
						role="dialog"
						aria-modal="true"
						className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-xl bg-k-0 shadow-xl"
					>
						<div className="flex items-center justify-between border-b border-k-100 px-5 py-4">
							<div>
								<p className="typo-sb-9 text-k-900">지원 대학 수정</p>
								<p className="mt-0.5 typo-regular-4 text-k-500">{editModal.name}</p>
							</div>
							<button
								type="button"
								onClick={() => setEditModal({ open: false })}
								className="typo-regular-4 text-k-400 hover:text-k-700"
							>
								✕
							</button>
						</div>
						<form onSubmit={handleEditSubmit} className="space-y-3 p-5">
							<div className="space-y-1">
								<label htmlFor={`${uid}-edit-student-capacity`} className="typo-sb-11 text-k-700">
									정원
								</label>
								<Input
									id={`${uid}-edit-student-capacity`}
									type="number"
									min={1}
									value={editForm.studentCapacity ?? ""}
									onChange={(e) =>
										setEditForm((p) => ({
											...p,
											studentCapacity: e.target.value ? Number(e.target.value) : undefined,
										}))
									}
								/>
							</div>
							<div className="space-y-1">
								<label htmlFor={`${uid}-edit-semester-dispatch`} className="typo-sb-11 text-k-700">
									파견 가능 학기
								</label>
								<select
									id={`${uid}-edit-semester-dispatch`}
									value={editForm.semesterAvailableForDispatch ?? ""}
									onChange={(e) =>
										setEditForm((p) => ({
											...p,
											semesterAvailableForDispatch: e.target.value || undefined,
										}))
									}
									className="h-9 w-full rounded-md border border-k-200 bg-k-0 px-3 typo-regular-4 text-k-700 outline-none focus-visible:border-primary"
								>
									<option value="">— 선택 안 함 —</option>
									{SEMESTER_OPTIONS.map((o) => (
										<option key={o.value} value={o.value}>
											{o.label}
										</option>
									))}
								</select>
							</div>
							{EDIT_TEXT_FIELDS.map(({ key, label }) => (
								<div key={key} className="space-y-1">
									<label htmlFor={`${uid}-edit-${key}`} className="typo-sb-11 text-k-700">
										{label}
									</label>
									<Input
										id={`${uid}-edit-${key}`}
										value={editForm[key] ?? ""}
										onChange={(e) =>
											setEditForm((p) => ({
												...p,
												[key]: e.target.value || undefined,
											}))
										}
									/>
								</div>
							))}
							<div className="space-y-1">
								<label htmlFor={`${uid}-edit-extra-info`} className="typo-sb-11 text-k-700">
									추가 정보 (JSON)
								</label>
								<Textarea
									id={`${uid}-edit-extra-info`}
									value={editExtraInfoText}
									onChange={(e) => setEditExtraInfoText(e.target.value)}
									placeholder='{"key": "value"}'
									className="h-20 font-mono"
								/>
							</div>
							<div className="flex justify-end gap-2 pt-2">
								<Button type="button" variant="secondary" onClick={() => setEditModal({ open: false })}>
									취소
								</Button>
								<Button type="submit" disabled={updateMutation.isPending}>
									{updateMutation.isPending ? "저장 중..." : "저장"}
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* 단건 추가 모달 */}
			{createModal.open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<button
						type="button"
						aria-label="모달 닫기"
						className="absolute inset-0 bg-black/50"
						onClick={() => setCreateModal({ open: false })}
					/>
					<div
						role="dialog"
						aria-modal="true"
						className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-xl bg-k-0 shadow-xl"
					>
						<div className="flex items-center justify-between border-b border-k-100 px-5 py-4">
							<p className="typo-sb-9 text-k-900">지원 대학 단건 추가</p>
							<button
								type="button"
								onClick={() => setCreateModal({ open: false })}
								className="typo-regular-4 text-k-400 hover:text-k-700"
							>
								✕
							</button>
						</div>
						<form onSubmit={handleCreateSubmit} className="space-y-3 p-5">
							<div className="space-y-1">
								<label htmlFor={`${uid}-create-term`} className="typo-sb-11 text-k-700">
									학기 *
								</label>
								<select
									id={`${uid}-create-term`}
									value={createForm.termId ?? ""}
									onChange={(e) =>
										setCreateForm((p) => ({
											...p,
											termId: e.target.value ? Number(e.target.value) : undefined,
										}))
									}
									required
									className="h-9 w-full rounded-md border border-k-200 bg-k-0 px-3 typo-regular-4 text-k-700 outline-none focus-visible:border-primary"
								>
									<option value="">학기 선택</option>
									{(termsQuery.data ?? []).map((t) => (
										<option key={t.id} value={t.id}>
											{t.label}
										</option>
									))}
								</select>
							</div>
							<div className="space-y-1">
								<label htmlFor={`${uid}-create-home-univ`} className="typo-sb-11 text-k-700">
									협정 대학 *
								</label>
								<select
									id={`${uid}-create-home-univ`}
									value={createForm.homeUniversityId ?? ""}
									onChange={(e) =>
										setCreateForm((p) => ({
											...p,
											homeUniversityId: e.target.value ? Number(e.target.value) : undefined,
										}))
									}
									required
									className="h-9 w-full rounded-md border border-k-200 bg-k-0 px-3 typo-regular-4 text-k-700 outline-none focus-visible:border-primary"
								>
									<option value="">협정 대학 선택</option>
									{(homeUniversitiesQuery.data ?? []).map((u) => (
										<option key={u.id} value={u.id}>
											{u.name}
										</option>
									))}
								</select>
							</div>
							<div className="space-y-1">
								<label htmlFor={`${uid}-create-host-keyword`} className="typo-sb-11 text-k-700">
									호스트 대학교 *
								</label>
								<div className="flex gap-2">
									<Input
										id={`${uid}-create-host-keyword`}
										value={hostKeyword}
										onChange={(e) => setHostKeyword(e.target.value)}
										placeholder="대학명으로 검색"
										className="flex-1"
									/>
									<Button type="button" variant="secondary" onClick={() => setHostSearchQuery(hostKeyword)}>
										검색
									</Button>
								</div>
								{(hostSearchQuery2.data?.content.length ?? 0) > 0 && (
									<select
										size={Math.min(5, hostSearchQuery2.data?.content.length ?? 0)}
										onChange={(e) =>
											setCreateForm((p) => ({
												...p,
												hostUniversityId: Number(e.target.value),
											}))
										}
										className="mt-1 w-full rounded-md border border-k-200 bg-k-0 px-3 py-1 typo-regular-4 text-k-700"
									>
										{hostSearchQuery2.data?.content.map((u) => (
											<option key={u.id} value={u.id}>
												{u.koreanName}
											</option>
										))}
									</select>
								)}
								{createForm.hostUniversityId && (
									<p className="typo-regular-4 text-primary">선택됨: ID {createForm.hostUniversityId}</p>
								)}
							</div>
							<div className="space-y-1">
								<label htmlFor={`${uid}-create-student-capacity`} className="typo-sb-11 text-k-700">
									정원
								</label>
								<Input
									id={`${uid}-create-student-capacity`}
									type="number"
									min={1}
									value={createForm.studentCapacity ?? ""}
									onChange={(e) =>
										setCreateForm((p) => ({
											...p,
											studentCapacity: e.target.value ? Number(e.target.value) : undefined,
										}))
									}
								/>
							</div>
							<div className="space-y-1">
								<label htmlFor={`${uid}-create-extra-info`} className="typo-sb-11 text-k-700">
									추가 정보 (JSON)
								</label>
								<Textarea
									id={`${uid}-create-extra-info`}
									value={createExtraInfoText}
									onChange={(e) => setCreateExtraInfoText(e.target.value)}
									placeholder='{"key": "value"}'
									className="h-20 font-mono"
								/>
							</div>
							<div className="flex justify-end gap-2 pt-2">
								<Button type="button" variant="secondary" onClick={() => setCreateModal({ open: false })}>
									취소
								</Button>
								<Button type="submit" disabled={createMutation.isPending}>
									{createMutation.isPending ? "추가 중..." : "추가"}
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
