import { type NextRequest, NextResponse } from "next/server";
import {
	AUTH_SESSION_COOKIE_NAME,
	authRedirects,
	isAuthRoute,
} from "@/lib/auth/session-config";

function hasAuthSession(request: NextRequest) {
	return Boolean(request.cookies.get(AUTH_SESSION_COOKIE_NAME)?.value);
}

function redirectTo(request: NextRequest, pathname: string) {
	const url = request.nextUrl.clone();
	url.pathname = pathname;
	url.search = "";

	return NextResponse.redirect(url);
}

function redirectToSignIn(request: NextRequest) {
	const url = request.nextUrl.clone();
	url.pathname = authRedirects.unauthenticated;
	url.search = "";
	url.searchParams.set(
		"callbackUrl",
		`${request.nextUrl.pathname}${request.nextUrl.search}`,
	);

	return NextResponse.redirect(url);
}

export function middleware(request: NextRequest) {
	const isAuthenticated = hasAuthSession(request);
	const isVisitingAuthRoute = isAuthRoute(request.nextUrl.pathname);

	if (isAuthenticated && isVisitingAuthRoute) {
		return redirectTo(request, authRedirects.authenticated);
	}

	if (!isAuthenticated && !isVisitingAuthRoute) {
		return redirectToSignIn(request);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|backend-api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
	],
};
