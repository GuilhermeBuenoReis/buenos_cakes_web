const AUTH_SESSION_COOKIE_NAME = "buenos-cakes-session";
const AUTH_SESSION_COOKIE_VALUE = "authenticated";

describe("Auth", () => {
	beforeEach(() => {
		cy.clearCookies();
		cy.clearLocalStorage();
	});

	it("keeps unauthenticated visitors on auth routes", () => {
		cy.visit("/dashboard");
		cy.url().should("match", /\/sign-in\?callbackUrl=%2Fdashboard$/);
		cy.contains("Bem-vindo de volta").should("be.visible");
	});

	it("redirects authenticated visitors away from auth routes", () => {
		cy.setCookie(AUTH_SESSION_COOKIE_NAME, AUTH_SESSION_COOKIE_VALUE, {
			domain: "localhost",
			path: "/",
			sameSite: "lax",
		});
		cy.visit("/sign-in");
		cy.url().should("match", /\/dashboard$/);
	});

	it("validates sign-in and navigates to sign-up", () => {
		cy.visit("/sign-in");
		cy.contains("Bem-vindo de volta").should("be.visible");

		cy.contains("button", /^Entrar$/).click();

		cy.contains("Informe um e-mail válido.").should("be.visible");
		cy.contains("Informe sua senha.").should("be.visible");

		cy.contains("a", "Criar conta").click();
		cy.url().should("match", /\/sign-up$/);
		cy.contains("Crie sua conta").should("be.visible");
	});

	it("validates sign-up and navigates back to sign-in", () => {
		cy.visit("/sign-up");
		cy.contains("Crie sua conta").should("be.visible");
		cy.contains("button", "Criar conta com Google").should("be.visible");

		cy.getByLabel("Nome completo").type("João");
		cy.getByLabel("E-mail").type("joao");
		cy.getByLabel("Senha", { exact: true }).type("123");
		cy.getByLabel("Confirmar senha", { exact: true }).type("456");
		cy.contains("button", /^Criar conta$/).click();

		cy.contains("Digite nome e sobrenome.").should("be.visible");
		cy.contains("Informe um e-mail válido.").should("be.visible");
		cy.contains("A senha deve ter pelo menos 8 caracteres.").should(
			"be.visible",
		);
		cy.contains("As senhas não coincidem.").should("be.visible");

		cy.contains("a", "Entrar").click();
		cy.url().should("match", /\/sign-in$/);
		cy.contains("Bem-vindo de volta").should("be.visible");
	});
});
