"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { adminApi, type UnivApplyInfoImportResponse } from "@/lib/api/admin";
import { preprocessMarkdownCountryCodes } from "./countryCodeAliases";
import { findFieldByHeader, UNIV_APPLY_INFO_FIELDS } from "./univApplyInfoFields";

function extractMarkdownHeaders(markdown: string): string[] {
	const lines = markdown.trim().split("\n");
	if (lines.length < 2) return [];
	const separatorPattern = /^\|[-| :]+\|$/;
	if (!separatorPattern.test(lines[1].trim())) return [];
	return lines[0]
		.split("|")
		.map((h) => h.trim())
		.filter((h) => h.length > 0);
}

function buildAutoMappings(headers: string[], languageTestTypes: string[]): Record<string, string> {
	const mappings: Record<string, string> = {};
	for (const header of headers) {
		const field = findFieldByHeader(header);
		if (field) {
			mappings[header] = field;
			continue;
		}
		if (languageTestTypes.includes(header)) {
			mappings[header] = header;
		}
	}
	return mappings;
}

function parsePreviewRows(markdown: string, columnMappings: Record<string, string>): Array<Record<string, string>> {
	const processed = preprocessMarkdownCountryCodes(markdown, columnMappings);
	const lines = processed.trim().split("\n");
	if (lines.length < 3) return [];

	const rawHeaders = lines[0]
		.split("|")
		.slice(1, -1)
		.map((h) => h.trim());

	return lines.slice(2).flatMap((line) => {
		const cells = line
			.split("|")
			.slice(1, -1)
			.map((c) => c.trim());
		const row: Record<string, string> = {};
		rawHeaders.forEach((header, i) => {
			const field = columnMappings[header];
			if (field && cells[i] !== undefined && cells[i] !== "") {
				row[field] = cells[i];
			}
		});
		return Object.keys(row).length > 0 ? [row] : [];
	});
}

export function UnivApplyInfosPageContent() {
	const homeUniversitySelectId = useId();
	const termSelectId = useId();

	const [homeUniversityId, setHomeUniversityId] = useState("");
	const [termId, setTermId] = useState("");
	const [markdown, setMarkdown] = useState("");
	const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
	const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
	const [importResult, setImportResult] = useState<UnivApplyInfoImportResponse | null>(null);
	const [showPreviewModal, setShowPreviewModal] = useState(false);

	const homeUniversitiesQuery = useQuery({
		queryKey: ["admin", "home-universities"],
		queryFn: adminApi.getHomeUniversities,
	});

	const termsQuery = useQuery({
		queryKey: ["admin", "terms"],
		queryFn: adminApi.getTerms,
	});

	const fieldsQuery = useQuery({
		queryKey: ["admin", "univ-apply-info-fields"],
		queryFn: adminApi.getUnivApplyInfoFields,
		staleTime: Number.POSITIVE_INFINITY,
	});

	const importMutation = useMutation({
		mutationFn: adminApi.importUnivApplyInfos,
		onSuccess: (data) => {
			setShowPreviewModal(false);
			setImportResult(data);
			if (data.failedRows.length === 0) {
				toast.success(`${data.successCount}건 모두 추가됐습니다.`);
			} else {
				toast.warning(`성공 ${data.successCount}건, 실패 ${data.failedRows.length}건`);
			}
		},
		onError: () => toast.error("지원 대학 추가에 실패했습니다."),
	});

	const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMarkdown(e.target.value);
		if (parsedHeaders.length > 0) {
			setParsedHeaders([]);
			setColumnMappings({});
			setImportResult(null);
		}
	};

	const handleParse = () => {
		const headers = extractMarkdownHeaders(markdown);
		if (headers.length === 0) {
			toast.error("마크다운 헤더를 파싱할 수 없습니다. 형식을 확인해주세요.");
			return;
		}
		const auto = buildAutoMappings(headers, fieldsQuery.data?.languageTestTypes ?? []);
		setParsedHeaders(headers);
		setColumnMappings(auto);
		setImportResult(null);
	};

	const handleImport = (e: FormEvent) => {
		e.preventDefault();
		const univId = Number(homeUniversityId);
		const term = Number(termId);
		if (!univId || !term) {
			toast.error("협정 대학과 학기를 선택해주세요.");
			return;
		}
		if (!markdown.trim()) {
			toast.error("마크다운을 입력해주세요.");
			return;
		}
		if (parsedHeaders.length === 0) {
			toast.error("먼저 [파싱] 버튼을 눌러 컬럼을 확인해주세요.");
			return;
		}
		setShowPreviewModal(true);
	};

	const handleConfirmImport = () => {
		const processedMarkdown = preprocessMarkdownCountryCodes(markdown.trim(), columnMappings);
		importMutation.mutate({
			homeUniversityId: Number(homeUniversityId),
			termId: Number(termId),
			markdown: processedMarkdown,
			columnMappings,
		});
	};

	const universities = homeUniversitiesQuery.data ?? [];
	const terms = termsQuery.data ?? [];
	const fields = fieldsQuery.data;

	const mappedFieldSet = new Set(Object.values(columnMappings).filter(Boolean));
	const previewColumns = [
		// 필수 필드: 매핑 여부와 관계없이 항상 표시
		...UNIV_APPLY_INFO_FIELDS.filter((f) => f.required).map((f) => ({
			field: f.field,
			label: f.label,
			required: true,
			mapped: mappedFieldSet.has(f.field),
		})),
		// 선택 필드: 매핑된 경우만 표시
		...UNIV_APPLY_INFO_FIELDS.filter((f) => !f.required && mappedFieldSet.has(f.field)).map((f) => ({
			field: f.field,
			label: f.label,
			required: false,
			mapped: true,
		})),
		// 언어 시험 타입 컬럼
		...[...mappedFieldSet]
			.filter((f) => !UNIV_APPLY_INFO_FIELDS.some((sf) => sf.field === f))
			.map((f) => ({ field: f, label: f, required: false, mapped: true })),
	];
	const previewRows = showPreviewModal ? parsePreviewRows(markdown.trim(), columnMappings) : [];

	return (
		<AdminLayout
			activeMenu="univApplyInfos"
			title="지원 대학 추가"
			description="마크다운 테이블을 붙여넣어 지원 가능 대학을 일괄 등록합니다."
		>
			<form onSubmit={handleImport} className="mt-4 space-y-4">
				{/* ① 기본 정보 */}
				<section className="rounded-xl border border-k-100 bg-k-0 p-4">
					<h2 className="typo-sb-9 text-k-900">① 기본 정보</h2>
					<div className="mt-3 grid gap-3 sm:grid-cols-2">
						<div className="space-y-1.5">
							<label className="typo-sb-11 text-k-700" htmlFor={homeUniversitySelectId}>
								협정 대학
							</label>
							<select
								id={homeUniversitySelectId}
								value={homeUniversityId}
								onChange={(e) => setHomeUniversityId(e.target.value)}
								className="h-9 w-full rounded-md border border-k-200 bg-k-0 px-3 typo-regular-4 text-k-700 outline-none focus-visible:border-primary"
							>
								<option value="">협정 대학 선택</option>
								{universities.map((u) => (
									<option key={u.id} value={u.id}>
										{u.name}
									</option>
								))}
							</select>
							{homeUniversitiesQuery.isLoading && <p className="mt-1 typo-regular-4 text-k-500">불러오는 중...</p>}
							{homeUniversitiesQuery.isError && (
								<p className="mt-1 typo-regular-4 text-magic-danger">협정 대학을 불러오지 못했습니다.</p>
							)}
						</div>
						<div className="space-y-1.5">
							<label className="typo-sb-11 text-k-700" htmlFor={termSelectId}>
								학기
							</label>
							<select
								id={termSelectId}
								value={termId}
								onChange={(e) => setTermId(e.target.value)}
								className="h-9 w-full rounded-md border border-k-200 bg-k-0 px-3 typo-regular-4 text-k-700 outline-none focus-visible:border-primary"
							>
								<option value="">학기 선택</option>
								{terms.map((t) => (
									<option key={t.id} value={t.id}>
										{t.label}
									</option>
								))}
							</select>
							{termsQuery.isLoading && <p className="mt-1 typo-regular-4 text-k-500">불러오는 중...</p>}
							{termsQuery.isError && (
								<p className="mt-1 typo-regular-4 text-magic-danger">학기 목록을 불러오지 못했습니다.</p>
							)}
						</div>
					</div>
				</section>

				{/* ② 마크다운 입력 */}
				<section className="rounded-xl border border-k-100 bg-k-0 p-4">
					<h2 className="typo-sb-9 text-k-900">② 마크다운 입력</h2>
					<p className="mt-1 typo-regular-4 text-k-500">파이프(|)로 구분된 마크다운 테이블을 붙여넣으세요.</p>
					<Textarea
						value={markdown}
						onChange={handleMarkdownChange}
						className="mt-3 h-48 font-mono"
						placeholder={"| 대학명 | 인원 | TOEIC |\n|--------|------|-------|\n| 괌 대학 | 2 | 800 |"}
					/>
					<Button type="button" className="mt-2" variant="secondary" onClick={handleParse} disabled={!markdown.trim()}>
						파싱
					</Button>
					{fieldsQuery.isError && (
						<p className="mt-1 typo-regular-4 text-magic-danger">
							필드 정보를 불러오지 못해 자동 매핑이 비활성화됩니다.
						</p>
					)}
				</section>

				{/* ③ 컬럼 매핑 */}
				{parsedHeaders.length > 0 && (
					<section className="rounded-xl border border-k-100 bg-k-0 p-4">
						<h2 className="typo-sb-9 text-k-900">③ 컬럼 매핑</h2>
						<p className="mt-1 typo-regular-4 text-k-500">
							마크다운 헤더를 시스템 필드에 매핑합니다. 비워두면 extraInfo에 저장됩니다.
						</p>
						<div className="mt-3 overflow-x-auto rounded-lg border border-k-100">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>마크다운 헤더</TableHead>
										<TableHead>시스템 필드</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{parsedHeaders.map((header) => (
										<TableRow key={header}>
											<TableCell className="font-mono">{header}</TableCell>
											<TableCell>
												{fields?.languageTestTypes.includes(columnMappings[header] ?? "") ? (
													<span className="inline-flex h-9 items-center rounded-md border border-k-200 bg-k-50 px-3 typo-regular-4 text-k-500">
														언어 시험 타입: {columnMappings[header]}
													</span>
												) : (
													<select
														value={columnMappings[header] ?? ""}
														onChange={(e) => setColumnMappings((prev) => ({ ...prev, [header]: e.target.value }))}
														className="h-9 min-w-[220px] rounded-md border border-k-200 bg-k-0 px-3 typo-regular-4 text-k-700 outline-none focus-visible:border-primary"
													>
														<option value="">매핑 없음 (extraInfo 저장)</option>
														{UNIV_APPLY_INFO_FIELDS.map((f) => (
															<option key={f.field} value={f.field}>
																{f.label}
															</option>
														))}
													</select>
												)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</section>
				)}

				{/* ④ 임포트 버튼 */}
				{parsedHeaders.length > 0 && (
					<div>
						<Button type="submit">지원 대학 추가</Button>
					</div>
				)}
			</form>

			{/* ⑤ 결과 */}
			{importResult && (
				<section className="mt-6 rounded-xl border border-k-100 bg-k-0 p-4">
					<h2 className="typo-sb-9 text-k-900">결과</h2>
					<p className="mt-2 typo-regular-4 text-k-700">
						성공 <span className="font-semibold text-primary">{importResult.successCount}</span>건
						{importResult.failedRows.length > 0 && (
							<>
								{" "}
								/ 실패 <span className="font-semibold text-magic-danger">{importResult.failedRows.length}</span>건
							</>
						)}
					</p>
					{importResult.createdUniversities.length > 0 && (
						<div className="mt-3 rounded-lg border border-k-100 p-3">
							<p className="typo-sb-11 text-k-700">신규 등록된 대학 {importResult.createdUniversities.length}개</p>
							<ul className="mt-1.5 space-y-0.5">
								{importResult.createdUniversities.map((name) => (
									<li key={name} className="typo-regular-4 text-k-500">
										{name}
									</li>
								))}
							</ul>
						</div>
					)}
					{importResult.failedRows.length > 0 && (
						<div className="mt-3 overflow-x-auto rounded-lg border border-k-100">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>행 번호</TableHead>
										<TableHead>실패 이유</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{importResult.failedRows.map((row) => (
										<TableRow key={row.rowNumber}>
											<TableCell>{row.rowNumber}</TableCell>
											<TableCell>{row.reason}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</section>
			)}

			{/* 임포트 미리보기 모달 */}
			{showPreviewModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<button
						type="button"
						aria-label="모달 닫기"
						className="absolute inset-0 bg-black/50"
						onClick={() => setShowPreviewModal(false)}
					/>
					<div
						role="dialog"
						aria-modal="true"
						className="relative flex max-h-[80vh] w-full max-w-4xl flex-col rounded-xl bg-k-0 shadow-xl"
					>
						{/* 모달 헤더 */}
						<div className="flex items-center justify-between border-b border-k-100 px-5 py-4">
							<div>
								<p className="typo-sb-9 text-k-900">임포트 미리보기</p>
								<p className="mt-0.5 typo-regular-4 text-k-500">
									총 {previewRows.length}개 대학 · {previewColumns.filter((c) => c.mapped).length}개 필드 매핑됨
									{previewColumns.filter((c) => c.required && !c.mapped).length > 0 && (
										<span className="ml-2 text-magic-danger">
											· 필수 {previewColumns.filter((c) => c.required && !c.mapped).length}개 미매핑
										</span>
									)}
								</p>
							</div>
							<button
								type="button"
								onClick={() => setShowPreviewModal(false)}
								className="typo-regular-4 text-k-400 hover:text-k-700"
							>
								✕
							</button>
						</div>

						{/* 모달 테이블 */}
						<div className="min-h-0 flex-1 overflow-auto">
							<table className="w-full border-collapse text-sm">
								<thead className="sticky top-0 bg-k-50">
									<tr>
										<th className="border-b border-k-100 px-3 py-2.5 text-left typo-sb-11 text-k-500">#</th>
										{previewColumns.map((col) => (
											<th
												key={col.field}
												className="border-b border-k-100 px-3 py-2.5 text-left typo-sb-11 whitespace-nowrap"
											>
												{col.mapped ? (
													<span className="text-k-700">{col.label}</span>
												) : (
													<span className="text-magic-danger">{col.label} *</span>
												)}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{previewRows.map((row, i) => (
										<tr key={Object.values(row).join("-")} className="border-b border-k-50 last:border-0">
											<td className="px-3 py-2 typo-regular-4 text-k-400">{i + 1}</td>
											{previewColumns.map((col) => {
												const value = row[col.field];
												return (
													<td key={col.field} className="max-w-[10rem] px-3 py-2 typo-regular-4 text-k-700">
														<span className="block truncate" title={value ?? ""}>
															{value ?? "—"}
														</span>
													</td>
												);
											})}
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* 모달 푸터 */}
						<div className="flex justify-end gap-2 border-t border-k-100 px-5 py-3">
							<Button type="button" variant="secondary" onClick={() => setShowPreviewModal(false)}>
								취소
							</Button>
							<Button type="button" onClick={handleConfirmImport} disabled={importMutation.isPending}>
								{importMutation.isPending ? "추가 중..." : "추가"}
							</Button>
						</div>
					</div>
				</div>
			)}
		</AdminLayout>
	);
}
