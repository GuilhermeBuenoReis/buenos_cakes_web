import { QueryClient } from "@tanstack/react-query";

const DEFAULT_STALE_TIME_MS = 1000 * 60;

export function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: 1,
				staleTime: DEFAULT_STALE_TIME_MS,
			},
		},
	});
}
