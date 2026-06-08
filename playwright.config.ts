import { defineConfig, devices } from "@playwright/test";

const HOST = "localhost";
const PORT = 3101;
const BASE_URL = `http://${HOST}:${PORT}`;
const API_BASE_URL = process.env.E2E_API_BASE_URL ?? "http://localhost:3333";
const AUTH_STORAGE_STATE_PATH = "./test-results/e2e-auth-storage.json";

export default defineConfig({
	testDir: "./src",
	testMatch: "**/*.e2e.spec.ts",
	fullyParallel: true,
	globalSetup: "./playwright.global-setup.ts",
	retries: 0,
	timeout: 60_000,
	workers: 4,
	use: {
		baseURL: BASE_URL,
		screenshot: "only-on-failure",
		storageState: AUTH_STORAGE_STATE_PATH,
		trace: "on",
		video: "retain-on-failure",
	},
	webServer: [
		{
			command: "pnpm --dir ../buenos_cakes_api dev",
			reuseExistingServer: true,
			timeout: 120_000,
			url: `${API_BASE_URL}/health`,
		},
		{
			command: `NEXT_DIST_DIR=.next-e2e NEXT_PUBLIC_E2E_STABLE_IMAGES=1 pnpm exec next dev --hostname ${HOST} --port ${PORT}`,
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
