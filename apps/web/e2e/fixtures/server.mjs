import { createServer } from "node:http";
import { WebSocket, WebSocketServer } from "ws";

// Local-only REST + SockJS/STOMP contract fixture. Never connects to the real API.
const host = "127.0.0.1";
const port = 43180;
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
  "base64",
);
const token = `${Buffer.from('{"alg":"none"}').toString("base64url")}.${Buffer.from(JSON.stringify({ sub: "101", role: "MENTEE", home_university: "1", exp: 4102444800 })).toString("base64url")}.fixture`;
const partner = (room) => ({
  partnerId: room === 1 ? 202 : 203,
  nickname: room === 1 ? "테스트 멘토" : "두번째 멘토",
  university: "테스트 대학",
  profileUrl: null,
});
const sockets = new Map();
let state;
function reset() {
  for (const ws of sockets.keys()) ws.close();
  sockets.clear();
  state = {
    paused: false,
    failRooms: false,
    failHistory: false,
    failUpload: false,
    denied: false,
    echo: true,
    sends: [],
    reads: 0,
    uploads: 0,
    unexpected: [],
    rooms: new Map([
      [1, []],
      [2, []],
    ]),
    nextId: 0,
  };
  for (let index = 0; index < 45; index++) append(1, `기존 메시지 ${index + 1}`, 202);
}
function append(room, content, senderId, attachments = []) {
  const message = {
    id: ++state.nextId,
    content,
    senderId,
    attachments,
    createdAt: new Date(Date.UTC(2026, 9, 1, 0, 0, state.nextId)).toISOString(),
  };
  state.rooms.get(room).push(message);
  return message;
}
function frame(ws, data) {
  if (ws.readyState === WebSocket.OPEN) ws.send(`a${JSON.stringify([data])}`);
}
function broadcast(room, message) {
  for (const [ws, subscription] of sockets) {
    if (subscription?.room !== room) continue;
    const body = JSON.stringify(message);
    frame(
      ws,
      `MESSAGE\nsubscription:${subscription.id}\nmessage-id:${message.id}\ndestination:/topic/chat/${room}\ncontent-type:application/json\n\n${body}\0`,
    );
  }
}
reset();
const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:43181");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  const url = new URL(req.url, `http://${host}:${port}`);
  const path = url.pathname;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString();
  const json = (data, status = 200) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  };
  const expectedMethod =
    path === "/__reset" || path === "/__control" || path.startsWith("/auth/") || path === "/file/chat"
      ? "POST"
      : /^\/chats\/rooms\/\d+\/read$/.test(path)
        ? "PUT"
        : "GET";
  if (req.method !== expectedMethod) {
    state.unexpected.push(`${req.method} ${path}`);
    return json({ message: `Expected ${expectedMethod} ${path}` }, 405);
  }
  const protectedPath =
    path === "/my" ||
    path.startsWith("/chats/") ||
    path.startsWith("/scores/") ||
    path === "/file/chat" ||
    path.startsWith("/applications/") ||
    path === "/auth/sign-out";
  if (protectedPath && req.headers.authorization !== `Bearer ${token}`) return json({}, 401);
  if (path === "/__health") return json({ ok: true });
  if (path === "/__reset") {
    reset();
    return json({ ok: true });
  }
  if (path === "/__state") return json({ ...state, rooms: Object.fromEntries(state.rooms) });
  if (path === "/__control") {
    const control = JSON.parse(raw);
    if (control.push) {
      for (let index = 0; index < control.push; index++) {
        const message = append(control.room ?? 1, `복구 메시지 ${index + 1}`, 202);
        if (!state.paused) broadcast(control.room ?? 1, message);
      }
    }
    for (const key of ["paused", "failRooms", "failHistory", "failUpload", "denied", "echo"]) {
      if (key in control) state[key] = control[key];
    }
    if (control.paused) for (const ws of sockets.keys()) ws.close();
    return json({ ok: true });
  }
  if (path === "/connect/info")
    return json({ websocket: true, cookie_needed: false, origins: ["*:*"], entropy: 12345 });
  if (path === "/image.png") {
    res.writeHead(200, { "Content-Type": "image/png" });
    res.end(png);
    return;
  }
  if (path === "/auth/email/sign-in") {
    const credentials = JSON.parse(raw);
    if (credentials.password !== "LocalTest123!") return json({ message: "이메일 또는 비밀번호를 확인해주세요." }, 401);
    return json({ accessToken: token, refreshToken: "fixture-only" });
  }
  if (path === "/auth/reissue") return json({ message: "fixture session expired" }, 401);
  if (path === "/auth/sign-out") return json({});
  if (path === "/my") {
    if (!req.headers.authorization) return json({}, 401);
    return json({
      role: "MENTEE",
      nickname: "테스트 학생",
      email: "student@example.test",
      authType: "EMAIL",
      profileImageUrl: null,
      interestedCountries: ["미국"],
      likedUniversityCount: 0,
      likedPostCount: 0,
      likedMentorCount: 0,
      homeUniversityName: "인하대학교",
    });
  }
  if (path === "/chats/rooms") {
    if (state.failRooms) return json({}, 503);
    return json({
      chatRooms: [1, 2].map((id) => ({
        id,
        partner: partner(id),
        lastChatMessage: state.rooms.get(id).at(-1)?.content ?? "",
        lastReceivedTime: "2026-10-01T10:00:00Z",
        unReadCount: id,
      })),
    });
  }
  const match = path.match(/^\/chats\/rooms\/(\d+)(?:\/(partner|read))?$/);
  if (match) {
    const room = Number(match[1]);
    if (state.denied || !state.rooms.has(room)) return json({}, 403);
    if (match[2] === "partner") return json(partner(room));
    if (match[2] === "read") {
      state.reads++;
      return json({});
    }
    if (state.failHistory) return json({}, 503);
    const page = Number(url.searchParams.get("page") ?? 1);
    const size = Number(url.searchParams.get("size") ?? 20);
    const messages = [...state.rooms.get(room)].reverse();
    return json({
      content: messages.slice((page - 1) * size, page * size),
      nextPageNumber: page * size < messages.length ? page + 1 : -1,
    });
  }
  if (path === "/file/chat") {
    state.uploads++;
    if (state.failUpload) return json({}, 503);
    const count = [...raw.matchAll(/filename="/g)].length;
    return json(Array.from({ length: count }, () => ({ fileUrl: `http://${host}:${port}/image.png` })));
  }
  if (path === "/news") return json({ newsResponseList: [] });
  if (path === "/univ-apply-infos/recommend") return json({ recommendedUniversities: [] });
  if (path.startsWith("/univ-apply-infos/search/")) return json({ univApplyInfoPreviews: [] });
  if (path.startsWith("/boards/"))
    return json([
      {
        id: 1,
        title: "교환학생 준비 질문",
        content: "지원 서류 준비는 어떻게 하나요?",
        likeCount: 0,
        commentCount: 0,
        createdAt: "2026-10-01T10:00:00Z",
        updatedAt: "2026-10-01T10:00:00Z",
        postCategory: "질문",
        postThumbnailUrl: null,
        postFindSiteUserResponse: { id: 202, nickname: "테스트 멘토", profileImageUrl: null },
      },
    ]);
  if (path === "/scores/gpas") return json({ homeUniversityName: "인하대학교", gpaScoreStatusResponseList: [] });
  if (path === "/scores/language-tests") return json({ languageTestScoreStatusResponseList: [] });
  if (path === "/applications/preview") return json({ totalUniversityCount: 0, universities: [] });
  state.unexpected.push(`${req.method} ${path}`);
  return json({ message: `Unimplemented fixture: ${req.method} ${path}` }, 501);
});
const wss = new WebSocketServer({ noServer: true });
server.on("upgrade", (req, socket, head) => {
  const url = new URL(req.url, `http://${host}:${port}`);
  if (url.searchParams.get("token") !== token) {
    state.unexpected.push("WebSocket authentication missing or invalid");
    socket.destroy();
    return;
  }
  if (state.paused || !/^\/connect\/[^/]+\/[^/]+\/websocket$/.test(url.pathname)) {
    socket.destroy();
    return;
  }
  wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws));
});
wss.on("connection", (ws) => {
  sockets.set(ws, null);
  ws.send("o");
  ws.on("close", () => sockets.delete(ws));
  ws.on("message", (data) => {
    for (const frameText of JSON.parse(data.toString())) {
      for (const frameData of frameText.split("\0")) {
        if (!frameData.trim()) continue;
        const [headersText, ...bodyParts] = frameData.replace(/^\n+/, "").split("\n\n");
        const [command, ...headerLines] = headersText.split("\n");
        const headers = Object.fromEntries(
          headerLines.map((line) => {
            const colon = line.indexOf(":");
            return [line.slice(0, colon), line.slice(colon + 1)];
          }),
        );
        if (command === "CONNECT" || command === "STOMP") frame(ws, "CONNECTED\nversion:1.2\nheart-beat:0,0\n\n\0");
        if (command === "SUBSCRIBE") {
          const subscription = headers.destination?.match(/^\/topic\/chat\/(\d+)$/);
          if (!subscription || !state.rooms.has(Number(subscription[1]))) {
            state.unexpected.push(`STOMP SUBSCRIBE ${headers.destination}`);
            frame(ws, "ERROR\nmessage:Invalid subscription\n\n\0");
            continue;
          }
          sockets.set(ws, { room: Number(subscription[1]), id: headers.id });
        }
        if (command === "SEND") {
          const destination = headers.destination?.match(/^\/publish\/chat\/(\d+)(\/image)?$/);
          if (!destination || !state.rooms.has(Number(destination[1]))) {
            state.unexpected.push(`STOMP SEND ${headers.destination}`);
            frame(ws, "ERROR\nmessage:Invalid destination\n\n\0");
            continue;
          }
          const room = Number(destination[1]);
          const body = JSON.parse(bodyParts.join("\n\n"));
          const validPayload = destination[2]
            ? Array.isArray(body.imageUrls) &&
              body.imageUrls.length > 0 &&
              body.imageUrls.every((url) => typeof url === "string")
            : body.senderId === 101 && typeof body.content === "string" && body.content.trim().length > 0;
          if (!validPayload) {
            state.unexpected.push(`STOMP PAYLOAD ${headers.destination}`);
            frame(ws, "ERROR\nmessage:Invalid payload\n\n\0");
            continue;
          }
          state.sends.push({ room, ...body });
          const attachments = (body.imageUrls ?? []).map((url, id) => ({
            id: id + 1,
            isImage: true,
            url,
            thumbnailUrl: null,
            createdAt: "2026-10-01T12:00:00Z",
          }));
          const message = append(room, body.content ?? "", body.senderId ?? 101, attachments);
          if (state.echo) broadcast(room, message);
        }
        if (command === "DISCONNECT") {
          if (headers.receipt) frame(ws, `RECEIPT\nreceipt-id:${headers.receipt}\n\n\0`);
          ws.close();
        }
      }
    }
  });
});
server.listen(port, host);
function shutdown() {
  for (const ws of sockets.keys()) ws.terminate();
  wss.close();
  server.close();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
