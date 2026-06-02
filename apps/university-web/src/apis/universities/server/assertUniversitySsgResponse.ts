import type { ServerFetchResult } from "@/utils/serverFetchUtil";

const MAX_ERROR_PREVIEW_LENGTH = 300;

export const assertUniversitySsgResponse = <T>(response: ServerFetchResult<T>, context: string): T => {
  if (response.ok) {
    return response.data;
  }

  const errorPreview =
    response.error.length > MAX_ERROR_PREVIEW_LENGTH
      ? `${response.error.slice(0, MAX_ERROR_PREVIEW_LENGTH)}...`
      : response.error;

  throw new Error(`[university-web SSG] ${context} failed with ${response.status}: ${errorPreview}`);
};
