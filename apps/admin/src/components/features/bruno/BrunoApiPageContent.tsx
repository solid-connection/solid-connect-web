"use client";

import {
	type BrunoApiDefinitionRegistryItem,
	brunoApiDefinitionRegistry,
} from "@solid-connect/api-schema/api-definition-registry";
import { AlertTriangle, Copy, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/api/client";
import { cn } from "@/lib/utils";

type EndpointItem = BrunoApiDefinitionRegistryItem;
type DefinitionMethod = EndpointItem["definition"]["method"];
type MethodFilter = "ALL" | DefinitionMethod;
type DomainFilter = "ALL" | string;

interface RequestResult {
	status: number;
	durationMs: number;
	headers: Record<string, string>;
	body: unknown;
}

interface EditorState {
	pathParamsText: string;
	queryParamsText: string;
	bodyText: string;
	headersText: string;
}

const ALL_ENDPOINTS: EndpointItem[] = [...brunoApiDefinitionRegistry].sort((a, b) => {
	if (a.domain === b.domain) {
		return a.displayName.localeCompare(b.displayName);
	}
	return a.domain.localeCompare(b.domain);
});

const METHOD_FILTERS: MethodFilter[] = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
const MUTATING_METHODS = new Set<DefinitionMethod>(["POST", "PUT", "PATCH", "DELETE"]);
const METHODS_WITHOUT_BODY = new Set<string>(["GET", "HEAD"]);
const apiServerUrl = import.meta.env.VITE_API_SERVER_URL?.trim() ?? "";

const toPrettyJson = (value: unknown): string => {
	if (value === undefined) {
		return "";
	}

	return JSON.stringify(value, null, 2) ?? "";
};

const buildEditorState = (endpoint: EndpointItem | null): EditorState => {
	if (!endpoint) {
		return {
			pathParamsText: "{}",
			queryParamsText: "{}",
			bodyText: "{}",
			headersText: "{}",
		};
	}

	return {
		pathParamsText: toPrettyJson(endpoint.definition.pathParamsExample),
		queryParamsText: toPrettyJson(endpoint.definition.queryParamsExample),
		bodyText: endpoint.definition.hasBody ? toPrettyJson(endpoint.definition.bodyExample ?? {}) : "{}",
		headersText: "{}",
	};
};

const parseJsonValue = (text: string, label: string): unknown => {
	if (!text.trim()) {
		return {};
	}

	try {
		return JSON.parse(text) as unknown;
	} catch {
		throw new Error(`${label} JSON 형식이 올바르지 않습니다.`);
	}
};

const parseJsonRecord = (text: string, label: string): Record<string, unknown> => {
	const parsed = parseJsonValue(text, label);
	if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
		throw new Error(`${label}는 JSON 객체여야 합니다.`);
	}

	return parsed as Record<string, unknown>;
};

const toStringRecord = (value: Record<string, unknown>): Record<string, string> => {
	return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, String(entry)]));
};

const resolvePathParamValue = (pathParams: Record<string, unknown>, tokenName: string) => {
	const value = pathParams[tokenName];
	if (value !== undefined && value !== null && String(value).trim().length > 0) {
		return encodeURIComponent(String(value));
	}

	throw new Error(`경로 파라미터 '${tokenName}' 값이 필요합니다.`);
};

const resolvePath = (rawPath: string, pathParams: Record<string, unknown>) => {
	const withoutBaseToken = rawPath.replace("{{URL}}", "");
	const resolvedBrunoPath = withoutBaseToken.replace(/\{\{([^}]+)\}\}/g, (_full, tokenName: string) => {
		if (tokenName === "URL") {
			return "";
		}

		return resolvePathParamValue(pathParams, tokenName);
	});

	return resolvedBrunoPath.replace(/:(\w+)|\{(\w+)\}/g, (_full, colonParam: string, braceParam: string) => {
		const tokenName = colonParam || braceParam;
		return resolvePathParamValue(pathParams, tokenName);
	});
};

const splitPathAndInlineQuery = (pathWithInlineQuery: string) => {
	const questionMarkIndex = pathWithInlineQuery.indexOf("?");
	const path = questionMarkIndex >= 0 ? pathWithInlineQuery.slice(0, questionMarkIndex) : pathWithInlineQuery;
	const queryString = questionMarkIndex >= 0 ? pathWithInlineQuery.slice(questionMarkIndex + 1) : "";
	const inlineQuery = Object.fromEntries(new URLSearchParams(queryString));
	return { path, inlineQuery };
};

const isRemoteApiServer = (url: string) => {
	if (!url) {
		return false;
	}

	return !/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(?::\d+)?/i.test(url);
};

const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

const getEndpointKey = (endpoint: EndpointItem) => `${endpoint.domain}:${endpoint.name}:${endpoint.sourceFile ?? ""}`;

const getMethodClassName = (method: DefinitionMethod) =>
	cn(
		"rounded px-1.5 py-0.5 typo-regular-4",
		method === "GET" && "bg-[#E8F3FF] text-[#1D4ED8]",
		method === "POST" && "bg-[#ECFDF3] text-[#047857]",
		method === "PUT" && "bg-[#FFF7ED] text-[#C2410C]",
		method === "PATCH" && "bg-[#FEF3C7] text-[#B45309]",
		method === "DELETE" && "bg-[#FEE2E2] text-[#B91C1C]",
		(method === "HEAD" || method === "OPTIONS") && "bg-k-100 text-k-700",
	);

export function BrunoApiPageContent() {
	const [search, setSearch] = useState("");
	const [methodFilter, setMethodFilter] = useState<MethodFilter>("ALL");
	const [domainFilter, setDomainFilter] = useState<DomainFilter>("ALL");
	const [selectedKey, setSelectedKey] = useState(ALL_ENDPOINTS[0] ? getEndpointKey(ALL_ENDPOINTS[0]) : "");
	const [editorState, setEditorState] = useState<EditorState>(() => buildEditorState(ALL_ENDPOINTS[0] ?? null));
	const [isSending, setIsSending] = useState(false);
	const [requestResult, setRequestResult] = useState<RequestResult | null>(null);
	const [editorError, setEditorError] = useState<string | null>(null);

	const domains = useMemo(() => Array.from(new Set(ALL_ENDPOINTS.map((endpoint) => endpoint.domain))).sort(), []);

	const visibleEndpoints = useMemo(() => {
		const normalized = search.trim().toLowerCase();
		return ALL_ENDPOINTS.filter((endpoint) => {
			if (methodFilter !== "ALL" && endpoint.definition.method !== methodFilter) {
				return false;
			}
			if (domainFilter !== "ALL" && endpoint.domain !== domainFilter) {
				return false;
			}
			if (!normalized) {
				return true;
			}

			return `${endpoint.domain} ${endpoint.name} ${endpoint.displayName} ${endpoint.definition.method} ${endpoint.definition.path}`
				.toLowerCase()
				.includes(normalized);
		});
	}, [domainFilter, methodFilter, search]);

	const selectedEndpoint = useMemo(() => {
		return ALL_ENDPOINTS.find((endpoint) => getEndpointKey(endpoint) === selectedKey) ?? null;
	}, [selectedKey]);

	const selectedCanExecute = selectedEndpoint
		? (selectedEndpoint.definition.canExecute ?? selectedEndpoint.definition.bodyType !== "multipart-form")
		: false;
	const selectedIsMultipart = selectedEndpoint?.definition.bodyType === "multipart-form";
	const selectedExecutionBlocked = selectedEndpoint ? !selectedCanExecute : false;
	const selectedIsMutating = selectedEndpoint ? MUTATING_METHODS.has(selectedEndpoint.definition.method) : false;
	const remoteWarningUrl =
		selectedEndpoint && isAbsoluteUrl(selectedEndpoint.definition.path)
			? selectedEndpoint.definition.path
			: apiServerUrl;
	const showRemoteWarning = isRemoteApiServer(remoteWarningUrl);

	useEffect(() => {
		setEditorState(buildEditorState(selectedEndpoint));
		setRequestResult(null);
		setEditorError(null);
	}, [selectedEndpoint]);

	const updateEditorState = (key: keyof EditorState, value: string) => {
		setEditorState((prev) => ({ ...prev, [key]: value }));
		setEditorError(null);
	};

	const handleResetEditors = () => {
		setEditorState(buildEditorState(selectedEndpoint));
		setRequestResult(null);
		setEditorError(null);
	};

	const handleCopyResponse = async () => {
		if (!requestResult) {
			return;
		}

		await navigator.clipboard.writeText(toPrettyJson(requestResult.body));
		toast.success("응답 JSON을 복사했습니다.");
	};

	const handleSendRequest = async () => {
		if (!selectedEndpoint) {
			toast.error("호출할 API를 선택해주세요.");
			return;
		}

		if (selectedExecutionBlocked) {
			toast.warning("이 API는 현재 테스트베드에서 실행할 수 없습니다.");
			return;
		}

		if (selectedIsMutating) {
			const confirmed = window.confirm(
				`${selectedEndpoint.definition.method} ${selectedEndpoint.definition.path}\n\n실제 API에 변경 요청을 보냅니다. 계속할까요?`,
			);

			if (!confirmed) {
				return;
			}
		}

		try {
			setIsSending(true);
			setEditorError(null);

			const pathParams = parseJsonRecord(editorState.pathParamsText, "Path Params");
			const queryParams = parseJsonRecord(editorState.queryParamsText, "Query Params");
			const headers = toStringRecord(parseJsonRecord(editorState.headersText, "Headers"));
			const body = parseJsonValue(editorState.bodyText, "Body");

			const resolvedPath = resolvePath(selectedEndpoint.definition.path, pathParams);
			const { path, inlineQuery } = splitPathAndInlineQuery(resolvedPath);
			const mergedQueryParams = { ...inlineQuery, ...queryParams };
			const method: DefinitionMethod = selectedEndpoint.definition.method;
			const shouldSendBody = !METHODS_WITHOUT_BODY.has(method);
			const startedAt = performance.now();

			const response = await axiosInstance.request({
				url: path,
				method,
				params: mergedQueryParams,
				data: shouldSendBody ? body : undefined,
				headers,
				validateStatus: () => true,
			});

			const durationMs = Math.round(performance.now() - startedAt);
			const responseHeaders = Object.fromEntries(
				Object.entries(response.headers).map(([key, value]) => [
					key,
					Array.isArray(value) ? value.join(", ") : String(value),
				]),
			);

			setRequestResult({
				status: response.status,
				durationMs,
				headers: responseHeaders,
				body: response.data,
			});
			if (response.status >= 200 && response.status < 300) {
				toast.success("요청이 완료되었습니다.");
			} else {
				toast.error(`요청이 실패했습니다. (HTTP ${response.status})`);
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : "요청 중 오류가 발생했습니다.";
			setEditorError(message);
			toast.error(message);
		} finally {
			setIsSending(false);
		}
	};

	return (
		<AdminLayout activeMenu="bruno" title="Bruno API" description="정의된 API를 조회하고 요청/응답을 검증합니다.">
			<div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
				<Card className="border-k-100">
					<CardHeader className="pb-3">
						<CardTitle className="typo-sb-9 text-k-800">Bruno API 목록</CardTitle>
						<Input
							placeholder="도메인/엔드포인트/경로 검색"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
						/>
						<div className="grid grid-cols-2 gap-2">
							<select
								value={domainFilter}
								onChange={(event) => setDomainFilter(event.target.value)}
								className="h-8 rounded-md border border-k-200 bg-k-0 px-2 typo-regular-4 text-k-700 outline-none focus-visible:border-primary"
							>
								<option value="ALL">모든 도메인</option>
								{domains.map((domain) => (
									<option key={domain} value={domain}>
										{domain}
									</option>
								))}
							</select>
							<select
								value={methodFilter}
								onChange={(event) => setMethodFilter(event.target.value as MethodFilter)}
								className="h-8 rounded-md border border-k-200 bg-k-0 px-2 typo-regular-4 text-k-700 outline-none focus-visible:border-primary"
							>
								{METHOD_FILTERS.map((method) => (
									<option key={method} value={method}>
										{method}
									</option>
								))}
							</select>
						</div>
						<p className="typo-regular-4 text-k-500">
							{visibleEndpoints.length} / {ALL_ENDPOINTS.length}개
						</p>
					</CardHeader>
					<CardContent className="max-h-[720px] overflow-auto pt-0">
						<div className="space-y-2">
							{visibleEndpoints.length > 0 ? (
								visibleEndpoints.map((endpoint) => {
									const key = getEndpointKey(endpoint);
									const active = key === selectedKey;

									return (
										<button
											key={key}
											type="button"
											onClick={() => setSelectedKey(key)}
											className={cn(
												"w-full rounded-md border px-3 py-2 text-left transition-colors",
												active ? "border-primary bg-primary-100" : "border-k-100 bg-k-0 hover:bg-k-50",
											)}
										>
											<div className="flex items-start justify-between gap-2">
												<div className="min-w-0">
													<p className="truncate typo-sb-11 text-k-800">{endpoint.displayName}</p>
													<p className="mt-1 truncate typo-regular-4 text-k-500">{endpoint.domain}</p>
												</div>
												<span className={getMethodClassName(endpoint.definition.method)}>
													{endpoint.definition.method}
												</span>
											</div>
											<p className="mt-2 break-all font-mono text-[11px] leading-4 text-k-500">
												{endpoint.definition.path}
											</p>
										</button>
									);
								})
							) : (
								<div className="rounded-md border border-dashed border-k-200 bg-bg-50 px-4 py-8 text-center typo-regular-4 text-k-500">
									표시할 API가 없습니다.
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				<div className="space-y-4">
					{showRemoteWarning ? (
						<div className="flex items-start gap-2 rounded-md border border-[#FACC15] bg-[#FEFCE8] px-4 py-3 text-[#854D0E]">
							<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
							<div className="min-w-0">
								<p className="typo-sb-11">원격 API 서버에 연결되어 있습니다.</p>
								<p className="mt-1 break-all typo-regular-4">{remoteWarningUrl}</p>
							</div>
						</div>
					) : null}

					<Card className="border-k-100">
						<CardHeader className="pb-3">
							<div className="flex flex-wrap items-center justify-between gap-2">
								<CardTitle className="typo-sb-9 text-k-800">요청 빌더</CardTitle>
								<div className="flex gap-2">
									<Button type="button" variant="outline" onClick={handleResetEditors}>
										<RotateCcw className="h-4 w-4" />
										초기화
									</Button>
									<Button
										type="button"
										onClick={handleSendRequest}
										disabled={isSending || !selectedEndpoint || selectedExecutionBlocked}
									>
										<Play className="h-4 w-4" />
										{isSending ? "요청 중..." : "요청 보내기"}
									</Button>
								</div>
							</div>
							{selectedEndpoint ? (
								<div className="rounded-md border border-k-100 bg-bg-50 px-3 py-2">
									<div className="flex flex-wrap items-center gap-2">
										<span className={getMethodClassName(selectedEndpoint.definition.method)}>
											{selectedEndpoint.definition.method}
										</span>
										<span className="typo-sb-11 text-k-700">{selectedEndpoint.displayName}</span>
									</div>
									<p className="mt-1 break-all font-mono text-xs leading-5 text-k-600">
										{selectedEndpoint.definition.path}
									</p>
									{selectedEndpoint.sourceFile ? (
										<p className="mt-1 break-all typo-regular-4 text-k-400">{selectedEndpoint.sourceFile}</p>
									) : null}
								</div>
							) : (
								<p className="typo-regular-4 text-k-500">왼쪽에서 API를 선택해주세요.</p>
							)}
							{selectedExecutionBlocked ? (
								<div className="rounded-md border border-k-200 bg-k-50 px-3 py-2 typo-regular-4 text-k-600">
									이 API는 v1 테스트베드에서 실행을 막아두었습니다.
								</div>
							) : null}
							{editorError ? (
								<div className="rounded-md border border-[#FCA5A5] bg-[#FEF2F2] px-3 py-2 typo-regular-4 text-[#B91C1C]">
									{editorError}
								</div>
							) : null}
						</CardHeader>
						<CardContent className="pt-0">
							<Tabs defaultValue="path">
								<TabsList>
									<TabsTrigger value="path">Path Params</TabsTrigger>
									<TabsTrigger value="query">Query</TabsTrigger>
									<TabsTrigger value="body" disabled={!selectedEndpoint?.definition.hasBody}>
										Body
									</TabsTrigger>
									<TabsTrigger value="headers">Headers</TabsTrigger>
								</TabsList>

								<TabsContent value="path">
									<Textarea
										value={editorState.pathParamsText}
										onChange={(event) => updateEditorState("pathParamsText", event.target.value)}
										className="min-h-36 font-mono"
									/>
								</TabsContent>
								<TabsContent value="query">
									<Textarea
										value={editorState.queryParamsText}
										onChange={(event) => updateEditorState("queryParamsText", event.target.value)}
										className="min-h-36 font-mono"
									/>
								</TabsContent>
								<TabsContent value="body">
									<Textarea
										value={editorState.bodyText}
										onChange={(event) => updateEditorState("bodyText", event.target.value)}
										className="min-h-44 font-mono"
										disabled={!selectedEndpoint?.definition.hasBody || selectedIsMultipart}
									/>
								</TabsContent>
								<TabsContent value="headers">
									<Textarea
										value={editorState.headersText}
										onChange={(event) => updateEditorState("headersText", event.target.value)}
										className="min-h-36 font-mono"
									/>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>

					<Card className="border-k-100">
						<CardHeader className="pb-3">
							<div className="flex flex-wrap items-center justify-between gap-2">
								<CardTitle className="typo-sb-9 text-k-800">응답</CardTitle>
								<Button type="button" variant="outline" onClick={handleCopyResponse} disabled={!requestResult}>
									<Copy className="h-4 w-4" />
									응답 복사
								</Button>
							</div>
							{requestResult ? (
								<div className="flex items-center gap-2 typo-regular-4 text-k-600">
									<span
										className={cn(
											"rounded px-2 py-1",
											requestResult.status >= 200 && requestResult.status < 300
												? "bg-[#ECFDF3] text-[#047857]"
												: "bg-[#FEF2F2] text-[#B91C1C]",
										)}
									>
										HTTP {requestResult.status}
									</span>
									<span>{requestResult.durationMs}ms</span>
								</div>
							) : null}
						</CardHeader>
						<CardContent className="pt-0">
							{requestResult ? (
								<Tabs defaultValue="body">
									<TabsList>
										<TabsTrigger value="body">Body</TabsTrigger>
										<TabsTrigger value="headers">Headers</TabsTrigger>
									</TabsList>
									<TabsContent value="body">
										<Textarea value={toPrettyJson(requestResult.body)} readOnly className="min-h-48 font-mono" />
									</TabsContent>
									<TabsContent value="headers">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Header</TableHead>
													<TableHead>Value</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{Object.entries(requestResult.headers).map(([key, value]) => (
													<TableRow key={key}>
														<TableCell className="font-mono text-k-600">{key}</TableCell>
														<TableCell className="break-all font-mono text-k-700">{value}</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TabsContent>
								</Tabs>
							) : (
								<div className="rounded-md border border-dashed border-k-200 bg-bg-50 px-4 py-8 text-center typo-regular-4 text-k-500">
									요청을 보내면 응답이 여기에 표시됩니다.
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</AdminLayout>
	);
}
