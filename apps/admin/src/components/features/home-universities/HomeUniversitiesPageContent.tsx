"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminApi, type HomeUniversityResponse } from "@/lib/api/admin";

export function HomeUniversitiesPageContent() {
	const queryClient = useQueryClient();
	const [name, setName] = useState("");
	const [maxChoiceCount, setMaxChoiceCount] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editingName, setEditingName] = useState("");
	const [editingMaxChoiceCount, setEditingMaxChoiceCount] = useState("");

	const query = useQuery({
		queryKey: ["admin", "home-universities"],
		queryFn: adminApi.getHomeUniversities,
		placeholderData: keepPreviousData,
	});

	const universities = query.data ?? [];

	const invalidate = async () => {
		await queryClient.invalidateQueries({ queryKey: ["admin", "home-universities"] });
	};

	const createMutation = useMutation({
		mutationFn: adminApi.createHomeUniversity,
		onSuccess: async () => {
			await invalidate();
			setName("");
			setMaxChoiceCount("");
			toast.success("국내 대학을 생성했습니다.");
		},
		onError: () => toast.error("국내 대학 생성에 실패했습니다."),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, ...data }: { id: number; name: string; maxChoiceCount: number }) =>
			adminApi.updateHomeUniversity(id, data),
		onSuccess: async () => {
			await invalidate();
			setEditingId(null);
			toast.success("국내 대학을 수정했습니다.");
		},
		onError: () => toast.error("국내 대학 수정에 실패했습니다."),
	});

	const deleteMutation = useMutation({
		mutationFn: adminApi.deleteHomeUniversity,
		onSuccess: async () => {
			await invalidate();
			toast.success("국내 대학을 삭제했습니다.");
		},
		onError: () => toast.error("국내 대학 삭제에 실패했습니다."),
	});

	const handleCreate = (e: FormEvent) => {
		e.preventDefault();
		const trimmedName = name.trim();
		const count = Number(maxChoiceCount);
		if (!trimmedName || !Number.isInteger(count) || count < 1) {
			toast.error("대학명과 최대 지망 수(1 이상)를 입력해주세요.");
			return;
		}
		createMutation.mutate({ name: trimmedName, maxChoiceCount: count });
	};

	const handleStartEdit = (univ: HomeUniversityResponse) => {
		setEditingId(univ.id);
		setEditingName(univ.name);
		setEditingMaxChoiceCount(String(univ.maxChoiceCount));
	};

	const handleUpdate = (id: number) => {
		const trimmedName = editingName.trim();
		const count = Number(editingMaxChoiceCount);
		if (!trimmedName || !Number.isInteger(count) || count < 1) {
			toast.error("대학명과 최대 지망 수(1 이상)를 입력해주세요.");
			return;
		}
		updateMutation.mutate({ id, name: trimmedName, maxChoiceCount: count });
	};

	const handleDelete = (id: number, univName: string) => {
		if (!window.confirm(`국내 대학 "${univName}"을 삭제할까요?`)) return;
		deleteMutation.mutate(id);
	};

	const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

	return (
		<AdminLayout
			activeMenu="homeUniversities"
			title="국내 대학 관리"
			description="자교 국내 대학과 최대 지망 수를 관리합니다."
		>
			<div className="mt-4">
				<section className="rounded-xl border border-k-100 bg-k-0 p-4">
					<div className="flex items-center justify-between gap-3">
						<div>
							<h2 className="typo-sb-9 text-k-900">국내 대학</h2>
							<p className="mt-1 typo-regular-4 text-k-500">예: 인하대학교</p>
						</div>
						<p className="typo-regular-4 text-k-500">총 {universities.length.toLocaleString()}건</p>
					</div>

					<form onSubmit={handleCreate} className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_140px_auto]">
						<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="대학명" />
						<Input
							value={maxChoiceCount}
							onChange={(e) => setMaxChoiceCount(e.target.value)}
							placeholder="최대 지망 수"
							type="number"
							min={1}
						/>
						<Button type="submit" disabled={createMutation.isPending}>
							생성
						</Button>
					</form>

					<div className="mt-4 overflow-x-auto rounded-lg border border-k-100">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>대학명</TableHead>
									<TableHead>최대 지망 수</TableHead>
									<TableHead>작업</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{query.isLoading ? (
									<TableRow>
										<TableCell colSpan={4} className="text-center typo-regular-4 text-k-500">
											불러오는 중...
										</TableCell>
									</TableRow>
								) : query.isError ? (
									<TableRow>
										<TableCell colSpan={4} className="text-center typo-regular-4 text-magic-danger">
											국내 대학을 불러오지 못했습니다.
										</TableCell>
									</TableRow>
								) : universities.length === 0 ? (
									<TableRow>
										<TableCell colSpan={4} className="text-center typo-regular-4 text-k-500">
											국내 대학이 없습니다.
										</TableCell>
									</TableRow>
								) : (
									universities.map((univ) => {
										const isEditing = editingId === univ.id;
										return (
											<TableRow key={univ.id} className="hover:bg-bg-50">
												<TableCell>{univ.id}</TableCell>
												<TableCell>
													{isEditing ? (
														<Input value={editingName} onChange={(e) => setEditingName(e.target.value)} />
													) : (
														univ.name
													)}
												</TableCell>
												<TableCell>
													{isEditing ? (
														<Input
															value={editingMaxChoiceCount}
															onChange={(e) => setEditingMaxChoiceCount(e.target.value)}
															type="number"
															min={1}
															className="w-24"
														/>
													) : (
														univ.maxChoiceCount
													)}
												</TableCell>
												<TableCell>
													{isEditing ? (
														<div className="flex items-center gap-2">
															<Button size="sm" onClick={() => handleUpdate(univ.id)} disabled={isMutating}>
																저장
															</Button>
															<Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>
																취소
															</Button>
														</div>
													) : (
														<div className="flex items-center gap-2">
															<Button
																size="sm"
																variant="secondary"
																onClick={() => handleStartEdit(univ)}
																disabled={isMutating}
															>
																수정
															</Button>
															<Button
																size="sm"
																variant="destructive"
																onClick={() => handleDelete(univ.id, univ.name)}
																disabled={isMutating}
															>
																삭제
															</Button>
														</div>
													)}
												</TableCell>
											</TableRow>
										);
									})
								)}
							</TableBody>
						</Table>
					</div>
				</section>
			</div>
		</AdminLayout>
	);
}
