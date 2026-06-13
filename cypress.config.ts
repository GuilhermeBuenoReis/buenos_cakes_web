import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		baseUrl: "http://localhost:3101",
		specPattern: "cypress/e2e/**/*.cy.ts",
		supportFile: "cypress/support/e2e.ts",
		viewportWidth: 1280,
		viewportHeight: 720,
		defaultCommandTimeout: 10000,
		video: false,
		screenshotOnRunFailure: true,
		env: {
			apiBaseUrl: "http://localhost:3333",
			E2E_USER_EMAIL: "codex.e2e@buenos-cakes.test",
			E2E_USER_NAME: "Cliente E2E Buenos",
			E2E_USER_PASSWORD: "SenhaTeste123",
		},
	},
});
