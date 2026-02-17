import { createFileRoute, redirect } from "@tanstack/react-router";
import { Copy, Play, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { isTokenExpired } from "@/lib/utils/jwtUtils";
import { loadAccessToken } from "@/lib/utils/localStorage";

type DefinitionMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiDefinitionEntry {
	method: DefinitionMethod;
	path: string;
	pathParams: Record<string, unknown>;
	queryParams: Record<string, unknown>;
	body: unknown;
	response: unknown;
}

interface EndpointItem {
	domain: string;
	name: string;
	definition: ApiDefinitionEntry;
}

interface RequestResult {
	status: number;
	durationMs: number;
	headers: Record<string, string>;
	body: unknown;
}

const definitionFileContents = import.meta.glob("../../../../../packages/api-schema/src/apis/*/apiDefinitions.ts", {
	eager: true,
	query: "?raw",
	import: "default",
}) as Record<string, string>;

const normalizeTokenKey = (value: string) => value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

const parseDefinitionRegistry = (): EndpointItem[] => {
	const endpoints: EndpointItem[] = [];

	for (const [modulePath, fileContent] of Object.entries(definitionFileContents)) {
		const domainMatch = modulePath.match(/apis\/([^/]+)\/apiDefinitions\.ts$/);
		if (!domainMatch) {
			continue;
		}

		const domain = domainMatch[1];
		const endpointPattern =
			/^\s*([^:\n]+):\s*\{\s*\n\s*method:\s*'([A-Z]+)'\s+as const,\s*\n\s*path:\s*'([^']+)'\s+as const,/gm;

		for (const match of fileContent.matchAll(endpointPattern)) {
			const endpointName = match[1]?.trim();
			const method = match[2]?.trim() as DefinitionMethod | undefined;
			const path = match[3]?.trim();

			if (!endpointName || !method || !path) {
				continue;
			}

			endpoints.push({
				domain,
				name: endpointName,
				definition: {
					method,
					path,
					pathParams: {},
					queryParams: {},
					body: {},
					response: {},
				},
			});
		}
	}

	return endpoints.sort((a, b) => {
		if (a.domain === b.domain) {
			return a.name.localeCompare(b.name);
		}
		return a.domain.localeCompare(b.domain);
	});
};

const ALL_ENDPOINTS = parseDefinitionRegistry();

const toPrettyJson = (value: unknown) => JSON.stringify(value, null, 2);

const parseJsonRecord = (text: string, label: string): Record<string, unknown> => {
	if (!text.trim()) {
		return {};
	}

	const parsed = JSON.parse(text) as unknown;
	if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
		throw new Error(`${label}는 JSON 객체여야 합니다.`);
	}

	return parsed as Record<string, unknown>;
};

const toStringRecord = (value: Record<string, unknown>): Record<string, string> => {
	return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, String(entry)]));
};

const resolvePath = (rawPath: string, pathParams: Record<string, unknown>) => {
	const withoutBaseToken = rawPath.replace("{{URL}}", "");

	return withoutBaseToken.replace(/\{\{([^}]+)\}\}/g, (_full, tokenName: string) => {
		const exact = pathParams[tokenName];
		if (exact !== undefined && exact !== null) {
			return encodeURIComponent(String(exact));
		}

		const normalizedToken = normalizeTokenKey(tokenName);
		const similarEntry = Object.entries(pathParams).find(
			([key, value]) => normalizeTokenKey(key) === normalizedToken && value !== undefined && value !== null,
		);

		if (similarEntry) {
			return encodeURIComponent(String(similarEntry[1]));
		}

		throw new Error(`경로 파라미터 '${tokenName}' 값이 필요합니다.`);
	});
};

export const Route = createFileRoute("/bruno/")({
	beforeLoad: () => {
		if (typeof window !== "undefined") {
			const token = loadAccessToken();
			if (!token || isTokenExpired(token)) {
				throw redirect({ to: "/auth/login" });
			}
		}
	},
	component: BrunoApiPage,
});

function BrunoApiPage() {
	const [search, setSearch] = useState("");
	const [selectedKey, setSelectedKey] = useState(
		ALL_ENDPOINTS[0] ? `${ALL_ENDPOINTS[0].domain}:${ALL_ENDPOINTS[0].name}` : "",
	);
	const [pathParamsText, setPathParamsText] = useState("{}");
	const [queryParamsText, setQueryParamsText] = useState("{}");
	const [bodyText, setBodyText] = useState("{}");
	const [headersText, setHeadersText] = useState("{}");
	const [isSending, setIsSending] = useState(false);
	const [requestResult, setRequestResult] = useState<RequestResult | null>(null);

	const visibleEndpoints = useMemo(() => {
		const normalized = search.trim().toLowerCase();
		if (!normalized) {
			return ALL_ENDPOINTS;
		}

		return ALL_ENDPOINTS.filter((endpoint) => {
			return `${endpoint.domain} ${endpoint.name} ${endpoint.definition.method} ${endpoint.definition.path}`
				.toLowerCase()
				.includes(normalized);
		});
	}, [search]);

	const selectedEndpoint = useMemo(() => {
		return ALL_ENDPOINTS.find((endpoint) => `${endpoint.domain}:${endpoint.name}` === selectedKey) ?? null;
	}, [selectedKey]);

	const handleResetEditors = () => {
		setPathParamsText("{}");
		setQueryParamsText("{}");
		setBodyText("{}");
		setHeadersText("{}");
		setRequestResult(null);
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

		try {
			setIsSending(true);

			const pathParams = parseJsonRecord(pathParamsText, "Path Params");
			const queryParams = parseJsonRecord(queryParamsText, "Query Params");
			const headers = toStringRecord(parseJsonRecord(headersText, "Headers"));
			const body = parseJsonRecord(bodyText, "Body");

			const path = resolvePath(selectedEndpoint.definition.path, pathParams);
			const startedAt = performance.now();

			const response = await axiosInstance.request({
				url: path,
				method: selectedEndpoint.definition.method,
				params: queryParams,
				data: selectedEndpoint.definition.method === "GET" ? undefined : body,
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
			toast.success("요청이 완료되었습니다.");
		} catch (error) {
			const message = error instanceof Error ? error.message : "요청 중 오류가 발생했습니다.";
			toast.error(message);
		} finally {
			setIsSending(false);
		}
	};

	return (
		<div className="mx-auto w-full max-w-[1440px] rounded-[24px] border border-k-100 bg-k-0 shadow-sdw-a">
			<div className="flex min-h-[calc(100vh-96px)]">
				<AdminSidebar activeMenu="bruno" />

				<section className="flex-1 bg-bg-50 p-7">
					<div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
						<Card className="border-k-100">
							<CardHeader className="pb-3">
								<CardTitle className="typo-sb-9 text-k-800">Bruno API 목록</CardTitle>
								<Input
									placeholder="도메인/엔드포인트 검색"
									value={search}
									onChange={(event) => setSearch(event.target.value)}
								/>
							</CardHeader>
							<CardContent className="max-h-[680px] overflow-auto pt-0">
								<div className="space-y-2">
									{visibleEndpoints.map((endpoint) => {
										const key = `${endpoint.domain}:${endpoint.name}`;
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
												<div className="flex items-center justify-between gap-2">
													<span className="truncate typo-sb-11 text-k-800">{endpoint.name}</span>
													<span className="rounded bg-k-100 px-1.5 py-0.5 typo-regular-4 text-k-700">
														{endpoint.definition.method}
													</span>
												</div>
												<p className="mt-1 truncate typo-regular-4 text-k-500">{endpoint.domain}</p>
											</button>
										);
									})}
								</div>
							</CardContent>
						</Card>

						<div className="space-y-4">
							<Card className="border-k-100">
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between gap-2">
										<CardTitle className="typo-sb-9 text-k-800">요청 빌더</CardTitle>
										<div className="flex gap-2">
											<Button type="button" variant="outline" onClick={handleResetEditors}>
												<RotateCcw className="h-4 w-4" />
												초기화
											</Button>
											<Button type="button" onClick={handleSendRequest} disabled={isSending || !selectedEndpoint}>
												<Play className="h-4 w-4" />
												{isSending ? "요청 중..." : "요청 보내기"}
											</Button>
										</div>
									</div>
									{selectedEndpoint ? (
										<div className="rounded-md border border-k-100 bg-bg-50 px-3 py-2">
											<p className="typo-sb-11 text-k-700">{selectedEndpoint.definition.method}</p>
											<p className="mt-1 break-all typo-regular-4 text-k-600">{selectedEndpoint.definition.path}</p>
										</div>
									) : (
										<p className="typo-regular-4 text-k-500">왼쪽에서 API를 선택해주세요.</p>
									)}
								</CardHeader>
								<CardContent className="pt-0">
									<Tabs defaultValue="path">
										<TabsList>
											<TabsTrigger value="path">Path Params</TabsTrigger>
											<TabsTrigger value="query">Query</TabsTrigger>
											<TabsTrigger value="body">Body</TabsTrigger>
											<TabsTrigger value="headers">Headers</TabsTrigger>
										</TabsList>

										<TabsContent value="path">
											<Textarea
												value={pathParamsText}
												onChange={(event) => setPathParamsText(event.target.value)}
												className="min-h-36 font-mono"
											/>
										</TabsContent>
										<TabsContent value="query">
											<Textarea
												value={queryParamsText}
												onChange={(event) => setQueryParamsText(event.target.value)}
												className="min-h-36 font-mono"
											/>
										</TabsContent>
										<TabsContent value="body">
											<Textarea
												value={bodyText}
												onChange={(event) => setBodyText(event.target.value)}
												className="min-h-44 font-mono"
											/>
										</TabsContent>
										<TabsContent value="headers">
											<Textarea
												value={headersText}
												onChange={(event) => setHeadersText(event.target.value)}
												className="min-h-36 font-mono"
											/>
										</TabsContent>
									</Tabs>
								</CardContent>
							</Card>

							<Card className="border-k-100">
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between gap-2">
										<CardTitle className="typo-sb-9 text-k-800">응답</CardTitle>
										<Button type="button" variant="outline" onClick={handleCopyResponse} disabled={!requestResult}>
											<Copy className="h-4 w-4" />
											응답 복사
										</Button>
									</div>
									{requestResult ? (
										<div className="flex items-center gap-2 typo-regular-4 text-k-600">
											<span className="rounded bg-k-100 px-2 py-1">HTTP {requestResult.status}</span>
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
				</section>
			</div>
		</div>
	);
}
