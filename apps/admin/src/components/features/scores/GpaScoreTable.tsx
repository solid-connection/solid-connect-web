import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { scoreApi } from "@/lib/api/scores";
import type { GpaScoreWithUser, VerifyStatus } from "@/types/scores";
import { ScoreVerifyButton } from "./ScoreVerifyButton";
import { StatusBadge } from "./StatusBadge";

interface Props {
	verifyFilter: VerifyStatus;
}

const S3_BASE_URL = (import.meta.env.VITE_S3_BASE_URL as string | undefined) || "";

export function GpaScoreTable({ verifyFilter }: Props) {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editingGpa, setEditingGpa] = useState<number>(0);
	const [editingGpaCriteria, setEditingGpaCriteria] = useState<number>(0);

	const { data, isLoading, isFetching } = useQuery({
		queryKey: ["scores", "gpa", verifyFilter, page],
		queryFn: () => scoreApi.getGpaScores({ verifyStatus: verifyFilter }, page),
		placeholderData: keepPreviousData,
	});

	const updateGpaMutation = useMutation({
		mutationFn: ({
			id,
			status,
			reason,
			score,
		}: {
			id: number;
			status: VerifyStatus;
			reason?: string;
			score: GpaScoreWithUser;
		}) => scoreApi.updateGpaScore(id, status, reason, score),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["scores", "gpa"] });
		},
	});

	const scores = data?.content ?? [];
	const totalPages = data?.totalPages ?? 1;

	const handleVerifyStatus = async (id: number, status: VerifyStatus, reason?: string) => {
		try {
			const score = scores.find((s) => s.gpaScoreStatusResponse.id === id);
			if (!score) {
				throw new Error("Score data is required");
			}

			await updateGpaMutation.mutateAsync({ id, status, reason, score });
		} catch (error) {
			console.error("Failed to update GPA score:", error);
			toast.error("성적 상태 업데이트에 실패했습니다");
		}
	};

	const handleEdit = (score: GpaScoreWithUser) => {
		setEditingId(score.gpaScoreStatusResponse.id);
		setEditingGpa(score.gpaScoreStatusResponse.gpaResponse.gpa);
		setEditingGpaCriteria(score.gpaScoreStatusResponse.gpaResponse.gpaCriteria);
	};

	const handleSave = async (score: GpaScoreWithUser) => {
		try {
			await updateGpaMutation.mutateAsync({
				id: score.gpaScoreStatusResponse.id,
				status: score.gpaScoreStatusResponse.verifyStatus,
				reason: score.gpaScoreStatusResponse.rejectedReason || undefined,
				score: {
					...score,
					gpaScoreStatusResponse: {
						...score.gpaScoreStatusResponse,
						gpaResponse: {
							...score.gpaScoreStatusResponse.gpaResponse,
							gpa: editingGpa,
							gpaCriteria: editingGpaCriteria,
						},
					},
				},
			});
			setEditingId(null);
			toast.success("GPA가 수정되었습니다");
		} catch (error) {
			console.error("Failed to update GPA:", error);
			toast.error("GPA 수정에 실패했습니다");
		}
	};

	const handlePageChange = (newPage: number) => {
		if (newPage < 1 || newPage > totalPages) return;
		setPage(newPage);
	};

	return (
		<div className="rounded-lg border border-k-100 bg-k-0">
			{isFetching && !isLoading ? (
				<div className="border-b border-k-100 px-4 py-2 typo-regular-4 text-k-500">최신 데이터를 불러오는 중...</div>
			) : null}
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>닉네임</TableHead>
							<TableHead>GPA</TableHead>
							<TableHead>기준점수</TableHead>
							<TableHead>상태</TableHead>
							<TableHead>제출일</TableHead>
							<TableHead>거절사유</TableHead>
							<TableHead>인증파일</TableHead>
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
						) : scores.length === 0 ? (
							<TableRow>
								<TableCell colSpan={9} className="text-center typo-regular-4 text-k-500">
									데이터가 없습니다
								</TableCell>
							</TableRow>
						) : (
							scores.map((score) => (
								<TableRow key={score.gpaScoreStatusResponse.id} className="hover:bg-bg-50">
									<TableCell>{score.gpaScoreStatusResponse.id}</TableCell>
									<TableCell>
										<div className="flex items-center">
											<img
												src={score.siteUserResponse.profileImageUrl}
												alt="프로필"
												className="mr-2 h-8 w-8 rounded-full border border-k-100"
											/>
											{score.siteUserResponse.nickname}
										</div>
									</TableCell>
									<TableCell>
										{editingId === score.gpaScoreStatusResponse.id ? (
											<div className="flex gap-2">
												<input
													type="number"
													step="0.01"
													value={editingGpa}
													onChange={(e) => setEditingGpa(Number.parseFloat(e.target.value))}
													className="w-20 rounded border border-k-200 bg-k-0 px-2 py-1 typo-regular-4 text-k-700"
												/>
											</div>
										) : (
											score.gpaScoreStatusResponse.gpaResponse.gpa
										)}
									</TableCell>
									<TableCell>
										{editingId === score.gpaScoreStatusResponse.id ? (
											<div className="flex gap-2">
												<input
													type="number"
													step="0.01"
													value={editingGpaCriteria}
													onChange={(e) => setEditingGpaCriteria(Number.parseFloat(e.target.value))}
													className="w-20 rounded border border-k-200 bg-k-0 px-2 py-1 typo-regular-4 text-k-700"
												/>
												<Button onClick={() => handleSave(score)} variant="default">
													저장
												</Button>
												<Button onClick={() => setEditingId(null)} variant="secondary">
													취소
												</Button>
											</div>
										) : (
											<div className="flex gap-2">
												{score.gpaScoreStatusResponse.gpaResponse.gpaCriteria}
												<Button onClick={() => handleEdit(score)} variant="secondary">
													수정
												</Button>
											</div>
										)}
									</TableCell>
									<TableCell>
										<StatusBadge status={score.gpaScoreStatusResponse.verifyStatus} />
									</TableCell>
									<TableCell>{format(new Date(score.gpaScoreStatusResponse.createdAt), "yyyy-MM-dd HH:mm")}</TableCell>
									<TableCell>{score.gpaScoreStatusResponse.rejectedReason || "-"}</TableCell>
									<TableCell>
										<a
											href={`${S3_BASE_URL}${score.gpaScoreStatusResponse.gpaResponse.gpaReportUrl}`}
											target="_blank"
											rel="noopener noreferrer"
											className="typo-medium-4 text-primary hover:text-primary-700 hover:underline"
										>
											파일 보기
										</a>
									</TableCell>
									<TableCell>
										<ScoreVerifyButton
											currentStatus={score.gpaScoreStatusResponse.verifyStatus}
											onVerifyChange={(status, reason) =>
												handleVerifyStatus(score.gpaScoreStatusResponse.id, status, reason)
											}
										/>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
			{/* 페이지네이션 */}
			<div className="mt-4 flex items-center justify-center gap-2 border-t border-k-100 p-4">
				<Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} variant="secondary">
					이전
				</Button>
				{Array.from({ length: totalPages }, (_, idx) => (
					<Button
						// biome-ignore lint/suspicious/noArrayIndexKey: pagination buttons are static
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
	);
}
