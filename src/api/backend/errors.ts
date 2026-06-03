import { BackendApiError } from "./http-client";

export function getBackendErrorMessage(error: unknown, fallback: string) {
	if (error instanceof BackendApiError && error.message) {
		return error.message;
	}

	if (error instanceof Error && error.message) {
		return error.message;
	}

	return fallback;
}
