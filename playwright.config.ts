import { defineConfig, devices } from "@playwright/test";
import {
	AUTH_SESSION_COOKIE_NAME,
	AUTH_SESSION_COOKIE_VALUE,
} from "./src/lib/auth/session-config";

const HOST = "localhost";
const PORT = 3101;
const BASE_URL = `http://${HOST}:${PORT}`;
const E2E_AUTH_STORAGE_STATE = {
	cookies: [
		{
			domain: HOST,
			expires: -1,
			httpOnly: false,
			name: AUTH_SESSION_COOKIE_NAME,
			path: "/",
			sameSite: "Lax" as const,
			secure: false,
			value: AUTH_SESSION_COOKIE_VALUE,
		},
	],
	origins: [],
};

export default defineConfig({
	testDir: "./src",
	testMatch: "**/*.e2e.spec.ts",
	fullyParallel: true,
	retries: 0,
	use: {
		baseURL: BASE_URL,
		screenshot: "only-on-failure",
		storageState: E2E_AUTH_STORAGE_STATE,
		trace: "on",
		video: "retain-on-failure",
	},
	webServer: [
		{
			command: `NEXT_DIST_DIR=.next-e2e pnpm exec next dev --hostname ${HOST} --port ${PORT}`,
			reuseExistingServer: true,
			timeout: 120_000,
			url: BASE_URL,
		},
	],
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
