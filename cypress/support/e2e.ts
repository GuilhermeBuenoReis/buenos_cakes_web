import "./commands";

Cypress.on("uncaught:exception", (err) => {
	if (err.message.includes("cannot have a negative time stamp")) {
		return false;
	}
	if (err.message.includes("NEXT_HTTP_ERROR_FALLBACK")) {
		return false;
	}
	if (err.message.includes("NEXT_REDIRECT")) {
		return false;
	}
});

beforeEach(() => {
	cy.loginAsE2EUser();
});
