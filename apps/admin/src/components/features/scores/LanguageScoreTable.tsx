import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { scoreApi } from "@/lib/api/scores";
import type { LanguageScoreWithUser, LanguageTestType, VerifyStatus } from "@/types/scores";
import { ScoreVerifyButton } from "./ScoreVerifyButton";
import { StatusBadge } from "./StatusBadge";

interface Props {
	verifyFilter: VerifyStatus;
}

const S3_BASE_URL = (import.meta.env.VITE_S3_BASE_URL as string | undefined) || "";

const LANGUAGE_TEST_OPTIONS: { value: LanguageTestType; label: string }[] = [
	{ value: "TOEIC", label: "TOEIC" },
	{ value: "TOEFL_IBT", label: "TOEFL IBT" },
	{ value: "TOEFL_ITP", label: "TOEFL ITP" },
	{ value: "IELTS", label: "IELTS" },
	{ value: "JLPT", label: "JLPT" },
	{ value: "NEW_HSK", label: "NEW HSK" },
	{ value: "DALF", label: "DALF" },
	{ value: "CEFR", label: "CEFR" },
	{ value: "TCF", label: "TCF" },
	{ value: "TEF", label: "TEF" },
	{ value: "DUOLINGO", label: "DUOLINGO" },
	{ value: "ETC", label: "기타" },
];

export function LanguageScoreTable({ verifyFilter }: Props) {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editingScore, setEditingScore] = useState<string>("");
	const [editingType, setEditingType] = useState<LanguageTestType>("TOEIC");

	const { data, isLoading, isFetching } = useQuery({
		queryKey: ["scores", "language", verifyFilter, page],
		queryFn: () => scoreApi.getLanguageScores({ verifyStatus: verifyFilter }, page),
		placeholderData: keepPreviousData,
	});

	const updateLanguageMutation = useMutation({
		mutationFn: ({
			id,
			status,
			reason,
			score,
		}: {
			id: number;
			status: VerifyStatus;
			reason?: string;
			score: LanguageScoreWithUser;
		}) => scoreApi.updateLanguageScore(id, status, reason, score),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["scores", "language"] });
		},
	});

	const scores = data?.content ?? [];
	const totalPages = data?.totalPages ?? 1;

	const handleVerifyStatus = async (id: number, status: VerifyStatus, reason?: string) => {
		try {
			const score = scores.find((s) => s.languageTestScoreStatusResponse.id === id);
			if (!score) {
				throw new Error("Score data is required");
			}

			await updateLanguageMutation.mutateAsync({ id, status, reason, score });
		} catch (error) {
			console.error("Failed to update Language score:", error);
			toast.error("성적 상태 업데이트에 실패했습니다");
		}
	};

	const handleEdit = (score: LanguageScoreWithUser) => {
		setEditingId(score.languageTestScoreStatusResponse.id);
		setEditingScore(score.languageTestScoreStatusResponse.languageTestResponse.languageTestScore);
		setEditingType(score.languageTestScoreStatusResponse.languageTestResponse.languageTestType as LanguageTestType);
	};

	const handleSave = async (score: LanguageScoreWithUser) => {
		try {
			await updateLanguageMutation.mutateAsync({
				id: score.languageTestScoreStatusResponse.id,
				status: score.languageTestScoreStatusResponse.verifyStatus,
				reason: score.languageTestScoreStatusResponse.rejectedReason || undefined,
				score: {
					...score,
					languageTestScoreStatusResponse: {
						...score.languageTestScoreStatusResponse,
						languageTestResponse: {
							...score.languageTestScoreStatusResponse.languageTestResponse,
							languageTestScore: editingScore,
							languageTestType: editingType,
						},
					},
				},
			});
			setEditingId(null);
			toast.success("어학성적이 수정되었습니다");
		} catch (error) {
			console.error("Failed to update language score:", error);
			toast.error("어학성적 수정에 실패했습니다");
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
							<TableHead>시험종류</TableHead>
							<TableHead>점수</TableHead>
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
								<TableRow key={score.languageTestScoreStatusResponse.id} className="hover:bg-bg-50">
									<TableCell>{score.languageTestScoreStatusResponse.id}</TableCell>
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
										{editingId === score.languageTestScoreStatusResponse.id ? (
											<div className="flex gap-2">
												<select
													value={editingType}
													onChange={(e) => setEditingType(e.target.value as LanguageTestType)}
													className="rounded border border-k-200 bg-k-0 px-2 py-1 typo-regular-4 text-k-700"
												>
													{LANGUAGE_TEST_OPTIONS.map((option) => (
														<option key={option.value} value={option.value}>
															{option.label}
														</option>
													))}
												</select>
											</div>
										) : (
											LANGUAGE_TEST_OPTIONS.find(
												(option) =>
													option.value === score.languageTestScoreStatusResponse.languageTestResponse.languageTestType,
											)?.label || score.languageTestScoreStatusResponse.languageTestResponse.languageTestType
										)}
									</TableCell>
									<TableCell>
										{editingId === score.languageTestScoreStatusResponse.id ? (
											<div className="flex gap-2">
												<input
													type="text"
													value={editingScore}
													onChange={(e) => setEditingScore(e.target.value)}
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
												{score.languageTestScoreStatusResponse.languageTestResponse.languageTestScore}
												<Button onClick={() => handleEdit(score)} variant="secondary">
													수정
												</Button>
											</div>
										)}
									</TableCell>
									<TableCell>
										<StatusBadge status={score.languageTestScoreStatusResponse.verifyStatus} />
									</TableCell>
									<TableCell>
										{format(new Date(score.languageTestScoreStatusResponse.createdAt), "yyyy-MM-dd HH:mm")}
									</TableCell>
									<TableCell>{score.languageTestScoreStatusResponse.rejectedReason || "-"}</TableCell>
									<TableCell>
										<a
											href={`${S3_BASE_URL}${score.languageTestScoreStatusResponse.languageTestResponse.languageTestReportUrl}`}
											target="_blank"
											rel="noopener noreferrer"
											className="typo-medium-4 text-primary hover:text-primary-700 hover:underline"
										>
											파일 보기
										</a>
									</TableCell>
									<TableCell>
										<ScoreVerifyButton
											currentStatus={score.languageTestScoreStatusResponse.verifyStatus}
											onVerifyChange={(status, reason) =>
												handleVerifyStatus(score.languageTestScoreStatusResponse.id, status, reason)
											}
										/>
									</TableCell>
								</TableRow>
							))
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
