"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminApi, type TermResponse } from "@/lib/api/admin";
import { normalizeTermName } from "./termValidation";

const TERMS_QUERY_KEY = ["admin", "terms"] as const;

export function TermsPageContent() {
	const queryClient = useQueryClient();
	const [name, setName] = useState("");

	const termsQuery = useQuery({
		queryKey: TERMS_QUERY_KEY,
		queryFn: adminApi.getTerms,
		placeholderData: keepPreviousData,
	});

	const invalidateTerms = async () => {
		await queryClient.invalidateQueries({ queryKey: TERMS_QUERY_KEY });
	};

	const createMutation = useMutation({
		mutationFn: adminApi.createTerm,
		onSuccess: async () => {
			await invalidateTerms();
			setName("");
			toast.success("학기를 생성했습니다.");
		},
		onError: () => toast.error("학기 생성에 실패했습니다."),
	});

	const activateMutation = useMutation({
		mutationFn: adminApi.activateTerm,
		onSuccess: async () => {
			await invalidateTerms();
			toast.success("현재 학기를 변경했습니다.");
		},
		onError: () => toast.error("현재 학기 설정에 실패했습니다."),
	});

	const handleCreate = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const normalizedName = normalizeTermName(name);

		if (!normalizedName) {
			toast.error("학기 이름은 2026-1 형식으로 입력해주세요.");
			return;
		}

		createMutation.mutate({ name: normalizedName });
	};

	const handleActivate = (term: TermResponse) => {
		const confirmed = window.confirm(`"${term.label}" 학기를 현재 학기로 설정할까요?`);
		if (!confirmed) return;

		activateMutation.mutate(term.id);
	};

	const terms = termsQuery.data ?? [];
	const isMutating = createMutation.isPending || activateMutation.isPending;

	return (
		<AdminLayout activeMenu="terms" title="학기 관리" description="학기를 생성하고 현재 학기를 설정합니다.">
			<div className="mt-4">
				<section className="rounded-xl border border-k-100 bg-k-0 p-4">
					<div className="flex items-center justify-between gap-3">
						<div>
							<h2 className="typo-sb-9 text-k-900">학기</h2>
							<p className="mt-1 typo-regular-4 text-k-500">예: 2026-1</p>
						</div>
						<p className="typo-regular-4 text-k-500">총 {terms.length.toLocaleString()}건</p>
					</div>

					<form onSubmit={handleCreate} className="mt-4 flex max-w-md gap-2">
						<Input
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder="2026-1"
							aria-label="학기 이름"
						/>
						<Button type="submit" disabled={isMutating}>
							생성
						</Button>
					</form>

					<div className="mt-4 overflow-x-auto rounded-lg border border-k-100">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>학기</TableHead>
									<TableHead>상태</TableHead>
									<TableHead>작업</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{termsQuery.isLoading ? (
									<TableRow>
										<TableCell colSpan={4} className="text-center typo-regular-4 text-k-500">
											불러오는 중...
										</TableCell>
									</TableRow>
								) : termsQuery.isError ? (
									<TableRow>
										<TableCell colSpan={4} className="text-center typo-regular-4 text-magic-danger">
											학기 목록을 불러오지 못했습니다.
										</TableCell>
									</TableRow>
								) : terms.length === 0 ? (
									<TableRow>
										<TableCell colSpan={4} className="text-center typo-regular-4 text-k-500">
											등록된 학기가 없습니다.
										</TableCell>
									</TableRow>
								) : (
									terms.map((term) => (
										<TableRow key={term.id} className="hover:bg-bg-50">
											<TableCell>{term.id}</TableCell>
											<TableCell>{term.label}</TableCell>
											<TableCell>
												{term.isCurrent ? (
													<span className="rounded-full bg-primary-100 px-2.5 py-1 typo-sb-11 text-primary">
														현재 학기
													</span>
												) : (
													"-"
												)}
											</TableCell>
											<TableCell>
												<Button
													size="sm"
													variant={term.isCurrent ? "secondary" : "default"}
													onClick={() => handleActivate(term)}
													disabled={term.isCurrent || isMutating}
												>
													{term.isCurrent ? "현재 학기" : "현재 학기로 설정"}
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</section>
			</div>
		</AdminLayout>
	);
}
