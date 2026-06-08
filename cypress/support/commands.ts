export {};

declare global {
	namespace Cypress {
		interface Chainable {
			loginAsE2EUser(): Chainable;
			getByLabel(label: string, options?: { exact?: boolean }): Chainable;
		}
	}
}

const E2E_USER = {
	email: "codex.e2e@buenos-cakes.test",
	name: "Cliente E2E Buenos",
	password: "SenhaTeste123",
};

Cypress.Commands.add("loginAsE2EUser", () => {
	const apiBaseUrl =
		(Cypress.env("apiBaseUrl") as string) ?? "http://localhost:3333";

	cy.session(
		"e2e-user",
		() => {
			cy.request({
				body: E2E_USER,
				failOnStatusCode: false,
				method: "POST",
				url: `${apiBaseUrl}/api/users/create`,
			});

			cy.request<{ accessToken: string; user: unknown }>({
				body: { email: E2E_USER.email, password: E2E_USER.password },
				method: "POST",
				url: `${apiBaseUrl}/api/users/login`,
			}).then(({ body }) => {
				cy.setCookie("buenos-cakes-session", "authenticated", {
					path: "/",
					sameSite: "lax",
				});
				cy.setCookie("accessToken", body.accessToken, {
					httpOnly: true,
					path: "/",
					sameSite: "lax",
				});
				cy.visit("/");
				cy.window().then((win) => {
					win.localStorage.setItem(
						"buenos-cakes:access-token",
						body.accessToken,
					);
					win.localStorage.setItem(
						"buenos-cakes:user",
						JSON.stringify(body.user),
					);
				});
			});
		},
		{
			cacheAcrossSpecs: true,
			validate: () => {
				cy.getCookie("buenos-cakes-session").should("exist");
			},
		},
	);
});

Cypress.Commands.add(
	"getByLabel",
	(label: string, options?: { exact?: boolean }) => {
		const exact = options?.exact ?? false;

		if (exact) {
			cy.get("label")
				.filter((_, el) => el.textContent?.trim() === label)
				.first()
				.then(($el) => {
					const forAttr = $el.attr("for");
					if (forAttr) {
						return cy.get(`#${forAttr}`);
					}
					return cy.wrap($el).find("input, textarea, select, button").first();
				});
		} else {
			cy.contains("label", label).then(($el) => {
				const forAttr = $el.attr("for");
				if (forAttr) {
					return cy.get(`#${forAttr}`);
				}
				return cy.wrap($el).find("input, textarea, select, button").first();
			});
		}
	},
);
