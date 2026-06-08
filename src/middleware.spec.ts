import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import {
	AUTH_SESSION_COOKIE_NAME,
	AUTH_SESSION_COOKIE_VALUE,
} from "@/lib/auth/session-config";
import { config, middleware } from "./middleware";

function makeRequest(
	pathname: string,
	authenticated = false,
	baseUrl = "http://localhost:3000",
) {
	const headers = new Headers({
		host: new URL(baseUrl).host,
	});

	if (authenticated) {
		headers.set(
			"cookie",
			`${AUTH_SESSION_COOKIE_NAME}=${AUTH_SESSION_COOKIE_VALUE}`,
		);
	}

	return new NextRequest(`${baseUrl}${pathname}`, {
		headers,
	});
}

describe("middleware", () => {
	it("keeps backend api proxy paths outside the auth proxy matcher", () => {
		expect(config.matcher[0]).toContain("backend-api");
	});

	it("redirects unauthenticated visitors to sign-in with callback", () => {
		const response = middleware(makeRequest("/products?page=2"));

		expect(response.status).toBe(307);
		expect(response.headers.get("location")).toBe(
			"http://localhost:3000/sign-in?callbackUrl=%2Fproducts%3Fpage%3D2",
		);
	});

	it("allows unauthenticated visitors on auth routes", () => {
		const response = middleware(makeRequest("/sign-up"));

		expect(response.status).toBe(200);
		expect(response.headers.get("location")).toBeNull();
	});

	it("redirects authenticated visitors from auth routes to dashboard", () => {
		const response = middleware(makeRequest("/sign-in", true));

		expect(response.status).toBe(307);
		expect(response.headers.get("location")).toBe(
			"http://localhost:3000/dashboard",
		);
	});

	it("allows authenticated visitors on protected routes", () => {
		const response = middleware(makeRequest("/checkout", true));

		expect(response.status).toBe(200);
		expect(response.headers.get("location")).toBeNull();
	});
});
