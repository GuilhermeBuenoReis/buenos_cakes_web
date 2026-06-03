import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import type { z } from "zod";
import { getStoredAccessToken } from "@/lib/auth/browser-session";
import { apiErrorResponseSchema } from "./schemas/api-error";

const DEFAULT_API_BASE_URL = "http://localhost:3333";
const DEFAULT_BROWSER_API_BASE_URL = "/backend-api";
const REQUEST_TIMEOUT_MS = 8000;

function getDefaultApiBaseUrl() {
	if (typeof window !== "undefined") {
		return DEFAULT_BROWSER_API_BASE_URL;
	}

	return DEFAULT_API_BASE_URL;
}

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? getDefaultApiBaseUrl(),
	headers: {
		Accept: "application/json",
	},
	timeout: REQUEST_TIMEOUT_MS,
});

export class BackendApiError extends Error {
	readonly data: unknown;
	readonly status: number;

	constructor(message: string, status: number, data?: unknown) {
		super(message);
		this.name = "BackendApiError";
		this.status = status;
		this.data = data;
	}
}

interface BackendRequestConfig<Schema extends z.ZodType>
	extends AxiosRequestConfig {
	responseSchema: Schema;
}

function getAxiosErrorMessage(error: AxiosError) {
	const parsedError = apiErrorResponseSchema.safeParse(error.response?.data);

	if (parsedError.success) {
		return parsedError.data.message;
	}

	return error.message;
}

function getAuthorizationHeaders() {
	const accessToken = getStoredAccessToken();

	if (!accessToken) {
		return {};
	}

	return {
		Authorization: `Bearer ${accessToken}`,
	};
}

export async function requestBackend<Schema extends z.ZodType>({
	responseSchema,
	...config
}: BackendRequestConfig<Schema>): Promise<z.infer<Schema>> {
	try {
		const response = await api.request({
			...config,
			headers: {
				...getAuthorizationHeaders(),
				...config.headers,
			},
		});
		const parsedResponse = responseSchema.safeParse(response.data);

		if (!parsedResponse.success) {
			throw new BackendApiError(
				"Backend response does not match the expected schema.",
				response.status,
				response.data,
			);
		}

		return parsedResponse.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new BackendApiError(
				getAxiosErrorMessage(error),
				error.response?.status ?? 0,
				error.response?.data,
			);
		}

		throw error;
	}
}
