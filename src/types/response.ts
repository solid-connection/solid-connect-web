export interface ApiError {
  code: string;
  message: string;
}

export type ApiResponse<T> = { success: true; data: T } | { success: false; error: ApiError };
