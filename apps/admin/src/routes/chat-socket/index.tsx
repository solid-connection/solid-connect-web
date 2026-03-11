import { Client, type IMessage, type StompHeaders, type StompSubscription } from "@stomp/stompjs";
import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Link2, LogIn, Plug, PlugZap, RefreshCw, Send } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminSignInApi } from "@/lib/api/auth";
import { loadAccessToken, loadRefreshToken, saveAccessToken, saveRefreshToken } from "@/lib/utils/localStorage";

type ConnectionState = "DISCONNECTED" | "CONNECTING" | "CONNECTED" | "ERROR";

interface ReceivedMessage {
	id: number;
	destination: string;
	receivedAt: string;
	headers: StompHeaders;
	rawBody: string;
}

interface EventLog {
	id: number;
	type: "SYSTEM" | "ERROR";
	message: string;
	createdAt: string;
}

interface PublishPreset {
	id: string;
	label: string;
	destination: string;
	payload: string;
}

const defaultDestinationTemplate = "/publish/chat/{roomId}";
const defaultTopicTemplate = "/topic/chat/{roomId}";
const defaultJsonPayload = '{\n  "content": "어드민 소켓 테스트 메시지",\n  "senderId": 1\n}';
const defaultHeadersJson = "{}";

const publishPresets: PublishPreset[] = [
	{
		id: "text",
		label: "텍스트 메시지",
		destination: "/publish/chat/{roomId}",
		payload: '{\n  "content": "안녕하세요. 어드민 소켓 테스트 메시지입니다.",\n  "senderId": 1\n}',
	},
	{
		id: "image",
		label: "이미지 메시지",
		destination: "/publish/chat/{roomId}/image",
		payload: '{\n  "imageUrls": ["https://example.com/image.png"]\n}',
	},
];

const normalizeBaseUrl = (value: string) => value.trim().replace(/\/+$/, "");

const resolveRoomTemplate = (template: string, roomId: string) => template.replaceAll("{roomId}", roomId.trim());

const toNowIso = () => new Date().toISOString();

const parseJsonRecord = (text: string, label: string): Record<string, string> => {
	if (!text.trim()) {
		return {};
	}

	const parsed = JSON.parse(text) as unknown;
	if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
		throw new Error(`${label}는 JSON 객체여야 합니다.`);
	}

	return Object.fromEntries(Object.entries(parsed).map(([key, value]) => [key, String(value)]));
};

const parseJsonBody = (text: string) => JSON.stringify(JSON.parse(text));

const extractApiErrorMessage = (error: unknown) =>
	error && typeof error === "object" && "response" in error
		? (error as { response?: { data?: { message?: string } } }).response?.data?.message
		: undefined;

const maskToken = (value: string | null) => {
	if (!value) {
		return "-";
	}
	if (value.length <= 20) {
		return value;
	}
	return `${value.slice(0, 10)}...${value.slice(-10)}`;
};

const maskQueryToken = (value: string) => {
	if (!value) {
		return "";
	}
	if (value.length <= 4) {
		return "*".repeat(value.length);
	}
	return `${"*".repeat(value.length - 4)}${value.slice(-4)}`;
};

export const Route = createFileRoute("/chat-socket/")({
	component: ChatSocketPage,
});

function ChatSocketPage() {
	const clientRef = useRef<Client | null>(null);
	const subscriptionRef = useRef<StompSubscription | null>(null);

	const [connectionState, setConnectionState] = useState<ConnectionState>("DISCONNECTED");
	const [serverUrl, setServerUrl] = useState(import.meta.env.VITE_API_SERVER_URL?.trim() ?? "");
	const [token, setToken] = useState("");
	const [refreshToken, setRefreshToken] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [roomId, setRoomId] = useState("");
	const [topicTemplate, setTopicTemplate] = useState(defaultTopicTemplate);
	const [destinationTemplate, setDestinationTemplate] = useState(defaultDestinationTemplate);
	const [publishHeadersText, setPublishHeadersText] = useState(defaultHeadersJson);
	const [jsonPayload, setJsonPayload] = useState(defaultJsonPayload);
	const [receivedMessages, setReceivedMessages] = useState<ReceivedMessage[]>([]);
	const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
	const [isPending, setIsPending] = useState(false);
	const [isSigningIn, setIsSigningIn] = useState(false);

	const socketUrl = useMemo(() => {
		const normalized = normalizeBaseUrl(serverUrl);
		if (!normalized || !token.trim()) {
			return "";
		}
		return `${normalized}/connect?token=${encodeURIComponent(token.trim())}`;
	}, [serverUrl, token]);
	const maskedSocketUrl = useMemo(() => {
		const trimmedToken = token.trim();
		if (!socketUrl || !trimmedToken) {
			return "";
		}
		return socketUrl.replace(encodeURIComponent(trimmedToken), encodeURIComponent(maskQueryToken(trimmedToken)));
	}, [socketUrl, token]);

	const appendLog = useCallback((type: EventLog["type"], message: string) => {
		setEventLogs((prev) =>
			[{ id: Date.now() + Math.random(), type, message, createdAt: toNowIso() }, ...prev].slice(0, 100),
		);
	}, []);

	useEffect(() => {
		const accessToken = loadAccessToken();
		const refreshTokenFromStorage = loadRefreshToken();
		if (accessToken) {
			setToken(accessToken);
		}
		if (refreshTokenFromStorage) {
			setRefreshToken(refreshTokenFromStorage);
		}
	}, []);

	const deactivateClient = useCallback(
		async (emitLog: boolean) => {
			setIsPending(true);
			try {
				if (subscriptionRef.current) {
					subscriptionRef.current.unsubscribe();
					subscriptionRef.current = null;
				}

				const currentClient = clientRef.current;
				clientRef.current = null;

				if (currentClient?.active) {
					await currentClient.deactivate();
				}

				setConnectionState("DISCONNECTED");
				if (emitLog) {
					appendLog("SYSTEM", "소켓 연결을 종료했습니다.");
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : "소켓 종료 중 오류가 발생했습니다.";
				setConnectionState("ERROR");
				appendLog("ERROR", message);
			} finally {
				setIsPending(false);
			}
		},
		[appendLog],
	);

	const handleLoadStoredToken = () => {
		const accessToken = loadAccessToken();
		const refreshTokenFromStorage = loadRefreshToken();
		setToken(accessToken ?? "");
		setRefreshToken(refreshTokenFromStorage ?? "");

		if (accessToken) {
			appendLog("SYSTEM", "저장된 AccessToken/RefreshToken을 불러왔습니다.");
			toast.success("저장된 토큰을 불러왔습니다.");
			return;
		}

		toast.error("저장된 AccessToken이 없습니다.");
	};

	const signInAndStoreTokens = async (nextEmail: string, nextPassword: string) => {
		const response = await adminSignInApi(nextEmail.trim(), nextPassword);
		const nextAccessToken = response.data.accessToken;
		const nextRefreshToken = response.data.refreshToken;

		saveAccessToken(nextAccessToken);
		saveRefreshToken(nextRefreshToken);
		setToken(nextAccessToken);
		setRefreshToken(nextRefreshToken);
		return nextAccessToken;
	};

	const handleSignIn = async () => {
		if (!email.trim() || !password.trim()) {
			toast.error("이메일/비밀번호를 입력해주세요.");
			return;
		}

		setIsSigningIn(true);
		try {
			await signInAndStoreTokens(email, password);
			appendLog("SYSTEM", "로그인 성공: 새 토큰이 반영되었습니다.");
			toast.success("로그인 성공. AccessToken을 갱신했습니다.");
		} catch (error) {
			const message = extractApiErrorMessage(error);
			appendLog("ERROR", `로그인 실패: ${message ?? "이메일/비밀번호를 확인해주세요."}`);
			toast.error(message ?? "로그인에 실패했습니다.");
		} finally {
			setIsSigningIn(false);
		}
	};

	useEffect(() => {
		return () => {
			void deactivateClient(false);
		};
	}, [deactivateClient]);

	const handleConnect = async (tokenOverride?: string) => {
		if (!roomId.trim()) {
			toast.error("Room ID를 입력해주세요.");
			return;
		}

		const nextToken = tokenOverride ?? token;
		const normalizedServerUrl = normalizeBaseUrl(serverUrl);
		const nextSocketUrl =
			normalizedServerUrl && nextToken.trim()
				? `${normalizedServerUrl}/connect?token=${encodeURIComponent(nextToken.trim())}`
				: "";

		if (!nextSocketUrl) {
			toast.error("서버 URL과 토큰을 확인해주세요.");
			return;
		}

		if (clientRef.current?.active) {
			await deactivateClient(false);
		}

		setIsPending(true);
		setConnectionState("CONNECTING");

		try {
			const nextClient = new Client({
				webSocketFactory: () => new SockJS(nextSocketUrl),
				reconnectDelay: 0,
				heartbeatIncoming: 50000,
				heartbeatOutgoing: 50000,
			});

			nextClient.onConnect = () => {
				const resolvedTopic = resolveRoomTemplate(topicTemplate, roomId);
				subscriptionRef.current = nextClient.subscribe(resolvedTopic, (message: IMessage) => {
					setReceivedMessages((prev) =>
						[
							{
								id: Date.now() + Math.random(),
								destination: resolvedTopic,
								receivedAt: toNowIso(),
								headers: message.headers,
								rawBody: message.body,
							},
							...prev,
						].slice(0, 100),
					);
				});

				setConnectionState("CONNECTED");
				setIsPending(false);
				appendLog("SYSTEM", `연결 완료 및 구독 시작: ${resolvedTopic}`);
			};

			nextClient.onStompError = (frame) => {
				setConnectionState("ERROR");
				setIsPending(false);
				appendLog("ERROR", `Broker error: ${frame.headers.message ?? "unknown"}`);
			};

			nextClient.onWebSocketError = () => {
				setConnectionState("ERROR");
				setIsPending(false);
				appendLog("ERROR", "WebSocket 에러가 발생했습니다.");
			};

			nextClient.onWebSocketClose = () => {
				setIsPending(false);
				setConnectionState("DISCONNECTED");
			};

			clientRef.current = nextClient;
			nextClient.activate();
		} catch (error) {
			const message = error instanceof Error ? error.message : "소켓 연결 중 오류가 발생했습니다.";
			setConnectionState("ERROR");
			setIsPending(false);
			appendLog("ERROR", message);
		}
	};

	const handleSignInAndConnect = async () => {
		if (!email.trim() || !password.trim()) {
			toast.error("이메일/비밀번호를 입력해주세요.");
			return;
		}
		if (!roomId.trim()) {
			toast.error("Room ID를 입력해주세요.");
			return;
		}

		setIsSigningIn(true);
		try {
			const nextAccessToken = await signInAndStoreTokens(email, password);
			appendLog("SYSTEM", "로그인 성공: 새 토큰으로 소켓 연결을 시도합니다.");
			await handleConnect(nextAccessToken);
		} catch (error) {
			const message = extractApiErrorMessage(error);
			appendLog("ERROR", `로그인 실패: ${message ?? "이메일/비밀번호를 확인해주세요."}`);
			toast.error(message ?? "로그인에 실패했습니다.");
		} finally {
			setIsSigningIn(false);
		}
	};

	const handleSendRaw = () => {
		const client = clientRef.current;
		if (!client?.connected) {
			toast.error("소켓이 연결되지 않았습니다.");
			return;
		}

		if (!roomId.trim()) {
			toast.error("Room ID를 입력해주세요.");
			return;
		}

		try {
			const parsedPayload = parseJsonBody(jsonPayload);
			const headers = parseJsonRecord(publishHeadersText, "Publish Headers");
			const trimmedToken = token.trim();
			if (trimmedToken && !headers.Authorization) {
				headers.Authorization = `Bearer ${trimmedToken}`;
			}
			const destination = resolveRoomTemplate(destinationTemplate, roomId);
			client.publish({
				destination,
				headers,
				body: parsedPayload,
			});
			appendLog("SYSTEM", `메시지 전송 완료: ${destination}`);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Payload JSON 형식이 올바르지 않습니다.";
			toast.error(message);
		}
	};

	const handleApplyPreset = (preset: PublishPreset) => {
		setDestinationTemplate(preset.destination);
		setJsonPayload(preset.payload);
		appendLog("SYSTEM", `프리셋 적용: ${preset.label}`);
	};

	return (
		<div className="mx-auto w-full max-w-[1440px] rounded-[24px] border border-k-100 bg-k-0 shadow-sdw-a">
			<div className="flex min-h-[calc(100vh-96px)]">
				<AdminSidebar activeMenu="chatSocket" />

				<section className="flex-1 bg-bg-50 p-7">
					<div className="grid gap-4 lg:grid-cols-[420px_minmax(0,1fr)]">
						<Card className="border-k-100">
							<CardHeader className="pb-3">
								<CardTitle className="typo-sb-9 text-k-800">채팅 소켓 테스트 콘솔</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 pt-0">
								<div className="rounded-md border border-k-100 bg-bg-50 p-3">
									<p className="typo-sb-11 text-k-700">즉시 로그인</p>
									<p className="mt-1 typo-regular-4 text-k-500">
										이 페이지에서 바로 로그인하면 AccessToken/RefreshToken을 저장하고 즉시 반영합니다.
									</p>
									<div className="mt-3 space-y-2">
										<Input
											placeholder="admin@example.com"
											value={email}
											onChange={(event) => setEmail(event.target.value)}
										/>
										<Input
											type="password"
											placeholder="비밀번호"
											value={password}
											onChange={(event) => setPassword(event.target.value)}
										/>
									</div>
									<div className="mt-2 flex flex-wrap gap-2">
										<Button type="button" variant="outline" onClick={() => void handleSignIn()} disabled={isSigningIn}>
											<LogIn className="h-4 w-4" />
											로그인 토큰 받기
										</Button>
										<Button
											type="button"
											onClick={() => void handleSignInAndConnect()}
											disabled={isSigningIn || isPending}
										>
											<KeyRound className="h-4 w-4" />
											로그인 + 연결
										</Button>
										<Button type="button" variant="ghost" onClick={handleLoadStoredToken}>
											<RefreshCw className="h-4 w-4" />
											저장 토큰 불러오기
										</Button>
									</div>
									<div className="mt-2 rounded-md border border-k-100 bg-k-0 px-2 py-1">
										<p className="font-mono text-[11px] text-k-500">refresh: {maskToken(refreshToken)}</p>
									</div>
								</div>
								<div className="space-y-1">
									<p className="typo-sb-11 text-k-700">API 서버 URL</p>
									<Input value={serverUrl} onChange={(event) => setServerUrl(event.target.value)} />
								</div>
								<div className="space-y-1">
									<p className="typo-sb-11 text-k-700">Access Token</p>
									<Textarea
										value={token}
										onChange={(event) => setToken(event.target.value)}
										className="min-h-20 font-mono"
									/>
								</div>
								<div className="space-y-1">
									<p className="typo-sb-11 text-k-700">Room ID</p>
									<Input value={roomId} onChange={(event) => setRoomId(event.target.value)} placeholder="예: 123" />
								</div>
								<div className="space-y-1">
									<p className="typo-sb-11 text-k-700">구독 Topic</p>
									<Input
										value={topicTemplate}
										onChange={(event) => setTopicTemplate(event.target.value)}
										placeholder="/topic/chat/{roomId}"
									/>
								</div>
								<div className="rounded-md border border-k-100 bg-bg-50 px-3 py-2">
									<p className="typo-sb-11 text-k-700">연결 URL</p>
									<p className="break-all font-mono text-[12px] text-k-500">{maskedSocketUrl || "-"}</p>
								</div>
								<div className="rounded-md border border-k-100 bg-bg-50 px-3 py-2">
									<p className="typo-sb-11 text-k-700">연결 상태</p>
									<p className="font-mono text-[12px] text-k-500">{connectionState}</p>
								</div>
								<div className="flex gap-2">
									<Button type="button" onClick={() => void handleConnect()} disabled={isPending}>
										<Plug className="h-4 w-4" />
										연결
									</Button>
									<Button
										type="button"
										variant="outline"
										onClick={() => void deactivateClient(true)}
										disabled={isPending}
									>
										<PlugZap className="h-4 w-4" />
										연결 종료
									</Button>
								</div>
							</CardContent>
						</Card>

						<div className="space-y-4">
							<Card className="border-k-100">
								<CardHeader className="pb-3">
									<CardTitle className="typo-sb-9 text-k-800">메시지 발행</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3 pt-0">
									<div className="flex flex-wrap gap-2">
										{publishPresets.map((preset) => (
											<Button
												key={preset.id}
												type="button"
												variant="outline"
												size="sm"
												onClick={() => handleApplyPreset(preset)}
											>
												{preset.label}
											</Button>
										))}
									</div>
									<div className="space-y-1">
										<p className="typo-sb-11 text-k-700">Destination</p>
										<Input
											value={destinationTemplate}
											onChange={(event) => setDestinationTemplate(event.target.value)}
											placeholder="/publish/chat/{roomId}"
										/>
									</div>
									<div className="space-y-1">
										<p className="typo-sb-11 text-k-700">Publish Headers(JSON Object)</p>
										<Textarea
											value={publishHeadersText}
											onChange={(event) => setPublishHeadersText(event.target.value)}
											className="min-h-20 font-mono"
										/>
										<p className="typo-regular-4 text-k-500">
											`Authorization` 헤더가 없으면 현재 Access Token으로 자동 추가됩니다.
										</p>
									</div>
									<div className="space-y-1">
										<p className="typo-sb-11 text-k-700">Payload(JSON)</p>
										<Textarea
											value={jsonPayload}
											onChange={(event) => setJsonPayload(event.target.value)}
											className="min-h-36 font-mono"
										/>
									</div>
									<Button type="button" onClick={handleSendRaw} disabled={connectionState !== "CONNECTED"}>
										<Send className="h-4 w-4" />
										메시지 전송
									</Button>
								</CardContent>
							</Card>

							<Card className="border-k-100">
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between gap-2">
										<CardTitle className="typo-sb-9 text-k-800">이벤트 로그</CardTitle>
										<Button type="button" variant="outline" size="sm" onClick={() => setEventLogs([])}>
											로그 비우기
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-2 pt-0">
									{eventLogs.length === 0 ? (
										<p className="typo-regular-4 text-k-500">로그가 없습니다.</p>
									) : (
										eventLogs.map((eventLog) => (
											<div key={eventLog.id} className="rounded border border-k-100 bg-bg-50 px-3 py-2">
												<div className="flex items-center gap-2">
													<Link2 className="h-3 w-3 text-k-400" />
													<p className="font-mono text-[11px] text-k-500">{eventLog.createdAt}</p>
													<p className="font-mono text-[11px] text-k-700">{eventLog.type}</p>
												</div>
												<p className="mt-1 break-all font-mono text-[12px] text-k-600">{eventLog.message}</p>
											</div>
										))
									)}
								</CardContent>
							</Card>

							<Card className="border-k-100">
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between gap-2">
										<CardTitle className="typo-sb-9 text-k-800">수신 메시지</CardTitle>
										<Button type="button" variant="outline" size="sm" onClick={() => setReceivedMessages([])}>
											메시지 비우기
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-2 pt-0">
									{receivedMessages.length === 0 ? (
										<p className="typo-regular-4 text-k-500">수신된 메시지가 없습니다.</p>
									) : (
										receivedMessages.map((item) => (
											<div key={item.id} className="rounded border border-k-100 bg-bg-50 px-3 py-2">
												<p className="font-mono text-[11px] text-k-500">{item.receivedAt}</p>
												<p className="mt-1 font-mono text-[11px] text-k-600">topic: {item.destination}</p>
												<p className="mt-1 font-mono text-[11px] text-k-500">headers: {JSON.stringify(item.headers)}</p>
												<Textarea value={item.rawBody} readOnly className="mt-2 min-h-20 font-mono" />
											</div>
										))
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
