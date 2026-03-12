import { QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
				gcTime: 10 * 60 * 1000,
				refetchOnWindowFocus: false,
				retry: (failureCount, error) => {
					const status = (error as AxiosError | undefined)?.response?.status;
					if (status === 401 || status === 403) {
						return false;
					}

					return failureCount < 1;
				},
			},
		},
	});
