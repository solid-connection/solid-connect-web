import type { CreateAiInspectorRequestPayload, CreateAiInspectorRequestResponse } from "./types";

interface CreateAiInspectorRequestOptions {
  accessToken: string;
  payload: CreateAiInspectorRequestPayload;
  endpoint?: string;
  fetcher?: typeof fetch;
}

export class AiInspectorRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AiInspectorRequestError";
    this.status = status;
  }
}

export const createAiInspectorRequest = async (
  options: CreateAiInspectorRequestOptions,
): Promise<CreateAiInspectorRequestResponse> => {
  const { accessToken, payload, endpoint = "/api/ai-inspector-requests", fetcher = fetch } = options;
  const token = accessToken.trim();

  if (!token) {
    throw new AiInspectorRequestError("로그인 세션이 만료되었습니다. 다시 로그인해주세요.", 401);
  }

  const response = await fetcher(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as {
    message?: string;
    taskId?: string;
    status?: string;
  } | null;

  if (!response.ok) {
    throw new AiInspectorRequestError(
      data?.message ?? "요청 저장에 실패했습니다. 잠시 후 다시 시도해주세요.",
      response.status,
    );
  }

  return {
    taskId: data?.taskId ?? "",
    status: data?.status ?? "queued",
  };
};
