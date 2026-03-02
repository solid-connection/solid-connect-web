import { Client, type IMessage, type StompHeaders, type StompSubscription } from "@stomp/stompjs";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Link2, Plug, PlugZap, Send } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isTokenExpired } from "@/lib/utils/jwtUtils";
import { loadAccessToken } from "@/lib/utils/localStorage";

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

const defaultDestinationTemplate = "/publish/chat/{roomId}";
const defaultTopicTemplate = "/topic/chat/{roomId}";
const defaultJsonPayload = '{\n  "content": "어드민 소켓 테스트 메시지"\n}';

const normalizeBaseUrl = (value: string) => value.trim().replace(/\/+$/, "");

const resolveRoomTemplate = (template: string, roomId: string) => template.replaceAll("{roomId}", roomId.trim());

const toNowIso = () => new Date().toISOString();

export const Route = createFileRoute("/chat-socket/")({
	beforeLoad: () => {
		if (typeof window !== "undefined") {
			const token = loadAccessToken();
			if (!token || isTokenExpired(token)) {
				throw redirect({ to: "/auth/login" });
			}
		}
	},
	component: ChatSocketPage,
});

function ChatSocketPage() {
	const clientRef = useRef<Client | null>(null);
	const subscriptionRef = useRef<StompSubscription | null>(null);

	const [connectionState, setConnectionState] = useState<ConnectionState>("DISCONNECTED");
	const [serverUrl, setServerUrl] = useState(import.meta.env.VITE_API_SERVER_URL?.trim() ?? "");
	const [token, setToken] = useState("");
	const [roomId, setRoomId] = useState("");
	const [topicTemplate, setTopicTemplate] = useState(defaultTopicTemplate);
	const [destinationTemplate, setDestinationTemplate] = useState(defaultDestinationTemplate);
	const [jsonPayload, setJsonPayload] = useState(defaultJsonPayload);
	const [receivedMessages, setReceivedMessages] = useState<ReceivedMessage[]>([]);
	const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
	const [isPending, setIsPending] = useState(false);

	const socketUrl = useMemo(() => {
		const normalized = normalizeBaseUrl(serverUrl);
		if (!normalized || !token.trim()) {
			return "";
		}
		return `${normalized}/connect?token=${encodeURIComponent(token.trim())}`;
	}, [serverUrl, token]);

	const appendLog = useCallback((type: EventLog["type"], message: string) => {
		setEventLogs((prev) =>
			[{ id: Date.now() + Math.random(), type, message, createdAt: toNowIso() }, ...prev].slice(0, 100),
		);
	}, []);

	useEffect(() => {
		const accessToken = loadAccessToken();
		if (accessToken) {
			setToken(accessToken);
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

	useEffect(() => {
		return () => {
			void deactivateClient(false);
		};
	}, [deactivateClient]);

	const handleConnect = async () => {
		if (!roomId.trim()) {
			toast.error("Room ID를 입력해주세요.");
			return;
		}

		if (!socketUrl) {
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
				webSocketFactory: () => new SockJS(socketUrl),
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
				if (connectionState !== "ERROR") {
					setConnectionState("DISCONNECTED");
				}
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
			const parsedPayload = JSON.parse(jsonPayload);
			const destination = resolveRoomTemplate(destinationTemplate, roomId);
			client.publish({
				destination,
				body: JSON.stringify(parsedPayload),
			});
			appendLog("SYSTEM", `메시지 전송 완료: ${destination}`);
		} catch {
			toast.error("Payload JSON 형식이 올바르지 않습니다.");
		}
	};

	return (
		<div className="mx-auto w-full max-w-[1440px] rounded-[24px] border border-k-100 bg-k-0 shadow-sdw-a">
			<div className="flex min-h-[calc(100vh-96px)]">
				<AdminSidebar activeMenu="chatSocket" />

				<section className="flex-1 bg-bg-50 p-7">
					<div className="grid gap-4 lg:grid-cols-[420px_minmax(0,1fr)]">
						<Card className="border-k-100">
							<CardHeader className="pb-3">
								<CardTitle className="typo-sb-9 text-k-800">채팅 소켓 연결</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 pt-0">
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
									<p className="break-all font-mono text-[12px] text-k-500">{socketUrl || "-"}</p>
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
									<div className="space-y-1">
										<p className="typo-sb-11 text-k-700">Destination</p>
										<Input
											value={destinationTemplate}
											onChange={(event) => setDestinationTemplate(event.target.value)}
											placeholder="/publish/chat/{roomId}"
										/>
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
									<CardTitle className="typo-sb-9 text-k-800">이벤트 로그</CardTitle>
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
									<CardTitle className="typo-sb-9 text-k-800">수신 메시지</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2 pt-0">
									{receivedMessages.length === 0 ? (
										<p className="typo-regular-4 text-k-500">수신된 메시지가 없습니다.</p>
									) : (
										receivedMessages.map((item) => (
											<div key={item.id} className="rounded border border-k-100 bg-bg-50 px-3 py-2">
												<p className="font-mono text-[11px] text-k-500">{item.receivedAt}</p>
												<p className="mt-1 font-mono text-[11px] text-k-600">topic: {item.destination}</p>
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
