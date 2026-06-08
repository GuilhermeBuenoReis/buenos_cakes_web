import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { FullConfig } from "@playwright/test";
import {
	AUTH_SESSION_COOKIE_NAME,
	AUTH_SESSION_COOKIE_VALUE,
	authSessionStorageKeys,
} from "./src/lib/auth/session-config";

const DEFAULT_API_BASE_URL = "http://localhost:3333";
const DEFAULT_FRONTEND_BASE_URL = "http://localhost:3101";
const AUTH_STORAGE_STATE_PATH = "test-results/e2e-auth-storage.json";
const E2E_USER = {
	email: process.env.E2E_USER_EMAIL ?? "codex.e2e@buenos-cakes.test",
	name: process.env.E2E_USER_NAME ?? "Cliente E2E Buenos",
	password: process.env.E2E_USER_PASSWORD ?? "SenhaTeste123",
};

type BackendUser = {
	cpf?: string | null;
	createdAt: string;
	email: string;
	id: string;
	name: string;
	phone?: string | null;
	role: "admin" | "customer";
	updatedAt?: string | null;
};

type BackendLoginResponse = {
	accessToken: string;
	user: BackendUser;
};

class BackendSetupError extends Error {
	constructor(
		message: string,
		readonly status?: number,
	) {
		super(message);
		this.name = "BackendSetupError";
	}
}

function getApiBaseUrl() {
	return process.env.E2E_API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

function getFrontendBaseUrl(config: FullConfig) {
	return (
		config.projects[0]?.use.baseURL?.toString() ??
		process.env.E2E_BASE_URL ??
		DEFAULT_FRONTEND_BASE_URL
	);
}

async function readResponseError(response: Response) {
	try {
		const data = await response.json();

		if (
			data &&
			typeof data === "object" &&
			"message" in data &&
			typeof data.message === "string"
		) {
			return data.message;
		}
	} catch {
		return response.statusText;
	}

	return response.statusText;
}

async function requestBackend<TResponse>(
	pathname: string,
	init: RequestInit = {},
) {
	const response = await fetch(`${getApiBaseUrl()}${pathname}`, {
		...init,
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			...init.headers,
		},
	});

	if (!response.ok) {
		throw new BackendSetupError(
			await readResponseError(response),
			response.status,
		);
	}

	return (await response.json()) as TResponse;
}

async function ensureBackendIsHealthy() {
	const deadline = Date.now() + 60_000;
	let lastError: unknown;

	while (Date.now() < deadline) {
		try {
			const response = await fetch(`${getApiBaseUrl()}/health`);
			if (response.ok) return;
		} catch (error) {
			lastError = error;
		}

		await new Promise((resolve) => setTimeout(resolve, 1_000));
	}

	throw new Error(
		`Backend E2E indisponível em ${getApiBaseUrl()}/health. Último erro: ${
			lastError instanceof Error ? lastError.message : "sem resposta"
		}`,
	);
}

async function ensureE2EUserExists() {
	try {
		await requestBackend("/api/users/create", {
			body: JSON.stringify(E2E_USER),
			method: "POST",
		});
	} catch (error) {
		if (error instanceof BackendSetupError && error.status === 409) {
			return;
		}

		throw error;
	}
}

async function authenticateE2EUser() {
	return requestBackend<BackendLoginResponse>("/api/users/login", {
		body: JSON.stringify({
			email: E2E_USER.email,
			password: E2E_USER.password,
		}),
		method: "POST",
	});
}

async function assertCatalogHasProducts(accessToken: string) {
	const response = await requestBackend<{ products: unknown[] }>(
		"/api/products/active",
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	);

	if (response.products.length === 0) {
		throw new Error(
			"O backend E2E respondeu sem produtos ativos. Rode o seed do catálogo antes dos testes E2E.",
		);
	}
}

export default async function globalSetup(config: FullConfig) {
	await ensureBackendIsHealthy();
	await ensureE2EUserExists();

	const { accessToken, user } = await authenticateE2EUser();
	await assertCatalogHasProducts(accessToken);

	const frontendBaseUrl = getFrontendBaseUrl(config);
	const frontendUrl = new URL(frontendBaseUrl);
	const cookieExpiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
	const storageState = {
		cookies: [
			{
				domain: frontendUrl.hostname,
				expires: cookieExpiresAt,
				httpOnly: false,
				name: AUTH_SESSION_COOKIE_NAME,
				path: "/",
				sameSite: "Lax" as const,
				secure: frontendUrl.protocol === "https:",
				value: AUTH_SESSION_COOKIE_VALUE,
			},
			{
				domain: frontendUrl.hostname,
				expires: cookieExpiresAt,
				httpOnly: true,
				name: "accessToken",
				path: "/",
				sameSite: "Lax" as const,
				secure: frontendUrl.protocol === "https:",
				value: accessToken,
			},
		],
		origins: [
			{
				localStorage: [
					{
						name: authSessionStorageKeys.accessToken,
						value: accessToken,
					},
					{
						name: authSessionStorageKeys.user,
						value: JSON.stringify(user),
					},
				],
				origin: frontendUrl.origin,
			},
		],
	};

	const storagePath = path.resolve(AUTH_STORAGE_STATE_PATH);
	await mkdir(path.dirname(storagePath), { recursive: true });
	await writeFile(storagePath, JSON.stringify(storageState, null, 2));
}
