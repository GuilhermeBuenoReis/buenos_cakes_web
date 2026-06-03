import type { ApiUser } from "@/api/backend/schemas/user";
import {
	AUTH_SESSION_COOKIE_NAME,
	AUTH_SESSION_COOKIE_VALUE,
	AUTH_SESSION_MAX_AGE_SECONDS,
	authSessionStorageKeys,
} from "./session-config";

export interface AuthSession {
	accessToken: string;
	user: ApiUser;
}

function canUseBrowserSession() {
	return typeof window !== "undefined";
}

function getCookieSecureAttribute() {
	if (!canUseBrowserSession() || window.location.protocol !== "https:") {
		return "";
	}

	return "; Secure";
}

function setAuthSessionCookie() {
	// biome-ignore lint/suspicious/noDocumentCookie: Next proxy needs a route-readable session marker.
	window.document.cookie = `${AUTH_SESSION_COOKIE_NAME}=${AUTH_SESSION_COOKIE_VALUE}; Path=/; Max-Age=${AUTH_SESSION_MAX_AGE_SECONDS}; SameSite=Lax${getCookieSecureAttribute()}`;
}

function clearAuthSessionCookie() {
	// biome-ignore lint/suspicious/noDocumentCookie: keep browser storage and proxy cookie in sync.
	window.document.cookie = `${AUTH_SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${getCookieSecureAttribute()}`;
}

export function getStoredAccessToken() {
	if (!canUseBrowserSession()) {
		return null;
	}

	return window.localStorage.getItem(authSessionStorageKeys.accessToken);
}

export function persistAuthSession({ accessToken, user }: AuthSession) {
	if (!canUseBrowserSession()) {
		return;
	}

	window.localStorage.setItem(authSessionStorageKeys.accessToken, accessToken);
	window.localStorage.setItem(
		authSessionStorageKeys.user,
		JSON.stringify(user),
	);
	setAuthSessionCookie();
}

export function clearAuthSession() {
	if (!canUseBrowserSession()) {
		return;
	}

	window.localStorage.removeItem(authSessionStorageKeys.accessToken);
	window.localStorage.removeItem(authSessionStorageKeys.user);
	clearAuthSessionCookie();
}
