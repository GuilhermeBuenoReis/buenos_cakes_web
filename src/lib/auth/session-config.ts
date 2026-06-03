export const AUTH_SESSION_COOKIE_NAME = "buenos-cakes-session";
export const AUTH_SESSION_COOKIE_VALUE = "authenticated";
export const AUTH_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const authSessionStorageKeys = {
	accessToken: "buenos-cakes:access-token",
	user: "buenos-cakes:user",
} as const;

export const authRoutes = ["/sign-in", "/sign-up"] as const;

export const authRedirects = {
	authenticated: "/dashboard",
	unauthenticated: "/sign-in",
} as const;

export function isAuthRoute(pathname: string) {
	return authRoutes.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);
}

export function isSafeInternalRedirectPath(pathname: string) {
	return pathname.startsWith("/") && !pathname.startsWith("//");
}

export function getPostSignInRedirectPath(callbackUrl: string | null) {
	if (!callbackUrl || !isSafeInternalRedirectPath(callbackUrl)) {
		return authRedirects.authenticated;
	}

	const [pathname] = callbackUrl.split(/[?#]/);

	if (!pathname || isAuthRoute(pathname)) {
		return authRedirects.authenticated;
	}

	return callbackUrl;
}
